var mongoose = require('mongoose'),
	shortid = require('shortid'),
	Users = require('./users');

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
							response.writeHead(201,{'Content-Type':'application/json'});
							response.data.log = "An email has been sent containing a token to update your password";
							response.data.success = 1;
							response.end(JSON.stringify(response.data));
							return;
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