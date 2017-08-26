var mongoose = require('mongoose'),
	shortid = require('shortid'),
	Users = require('./users');

var sendgrid = require("sendgrid")("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");

var passwordChangeSchema = new mongoose.Schema({
	id: {type: String, unique: true},
	email: String,
	created_at: {type: Date, 'default': Date.now}
});

var passwordChange = mongoose.model('PasswordChange',passwordChangeSchema);

var exports = module.exports;

exports.create = function(requestBody,response){
	response.data = {};
	var uniq_id = shortid.generate();
	//send email to user
	Users.check_param_exists(requestBody.email,function(exists){
		
		if(exists){//if user exists
			passwordChange.remove({email: requestBody.email},function(error){//delete all existing tokens
				
				if(error){ //if error arises from data deletion
					console.log(error);//log error
					if(response==null){//check for error 500
						response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
						response.data.log = "Internal server error";//send message to user
						response.data.success = 0;//failed flag
						response.end(JSON.stringify(response.data));//send message to user
						return;
					}
				}else{
					var uniq_id = Math.floor(Math.random()*(999999-100000+1))+100000;
					uniq_id = ""+uniq_id+"";
					var PasswordChange = toForgotPassword(requestBody.email,uniq_id);//create password change schema

					PasswordChange.save(function(error){
						if(error){
							if(response==null){
								response.writeHead(500,{'Content-Type':'application/json'});
								response.data.log = "Internal server error";
								response.data.success = 0;
								response.end(JSON.stringify(response.data));
								return;
							}
						}else{

							var request = sendgrid.emptyRequest({
							  method: 'POST',
							  path: '/v3/mail/send',
							  body: {
							    personalizations: [
							      {
							        to: [
							          {
							            email: requestBody.email,
							          },
							        ],
							        subject: 'Startupia account validation! Do not reply',
							      },
							    ],
							    from: {
							      email: 'recovery@startupia.io',
							    },
							    content: [
							      {
							        type: 'text/html',
							        value: "Your Password Change Token: "+uniq_id
							      },
							    ],
							  },
							});
							//With callback
							sendgrid.API(request, function(error, qresponse) {
							  if (error) {
							  	console.log(error);
								//send email here
								response.writeHead(200,{'Content-Type':'application/json'});//set response type
								response.data.log = "Trouble sending confirmation email";//log response
								response.data.success = 0;
								response.end(JSON.stringify(response.data));
							  }else{
								//send email here
								response.writeHead(201,{'Content-Type':'application/json'});//set response type
								response.data.log = "Check your email for confirmation email";//log response
								response.data.success = 1;
								response.end(JSON.stringify(response.data));
							  }
							  console.log(qresponse.statusCode);
							  console.log(qresponse.body);
							  console.log(qresponse.headers);
							});							
						}
					});
				}
			});
		}else{
			response.writeHead(201,{'Content-Type':'application/json'});
			response.data.log = "Email doesn't exist on our servers";
			response.data.success = 1;
			response.end(JSON.stringify(response.data));
			return;			
		}
	});
}

exports.verify_token = function(requestBody,response){//for verifying token sent to the user mail
	response.data = {};//initialize response sent to user
	 var email = requestBody.email,//initialize instance variables
	 	token = requestBody.token;

	passwordChange.findOne({$and: [{email: email},{id:token}]},function(error,data){//for checking if data supplied is valid
		if(error){//if error is found
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;//return on operation
			}
		}else{
			if(data){//if token is valid
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variable
				response.data.log = "Valid token";//send user response
				response.data.success = 1;//successful flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variable
				response.data.log = "Invalid token";//send user response
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}
	});
}

exports.change_password = function(requestBody,response){//for carrying out password change

	response.data = {};//initialize response sent to client
	var email = requestBody.email,//initialize instance variablls
		token = requestBody.token,
		password = requestBody.password;

	passwordChange.findOne({$and: [{email: email},{id:token}]},function(error,idata){//for checking if data supplied is valid
		if(error){//if error is found
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;//return on operation
			}
		}else{
			if(idata){//if token is valid
				Users.users_model.findOne({email: email},function(error,data){//carry out password change
					if(error){//if error is found
						console.log(error);//log error
						if(response==null){//check for error 500
							response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
							response.data.log = "Internal server error";//send message to user
							response.data.success = 0;//failed flag
							response.end(JSON.stringify(response.data));//send message to user
							return;//return on operation
						}
					}else{
						if(data){//if email is found
							data.password = password;//set new password

							data.save(function(error){//save new password; check for errors
								if(error){
									console.log(error);//log error
									if(response==null){//check for error 500
										response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
										response.data.log = "Internal server error";//send message to user
										response.data.success = 0;//failed flag
										response.end(JSON.stringify(response.data));//send message to user
										return;//return on operation
									}						
								}else{
									response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
									response.data.log = "Password Updated";//message for client
									response.data.success = 1;//success flag	
									response.end(JSON.stringify(response.data));//send message to user
									return;//return control
								}
							})
						}else{//if no user matches email
							response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
							response.data.log = "Oops email not found!";//message for client
							response.data.success = 0;//success flag	
							response.end(JSON.stringify(response.data));//send message to user
							return;//return control				
						}
					}
				});

			}else{
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variable
				response.data.log = "Invalid token";//send user response
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}
	});

	

}

function toForgotPassword(email,uniq_id){
	return new passwordChange({
		email: email,
		id: uniq_id		
	});
}