var mongoose = require("mongoose"),//requirements
	shortid = require("shortid"),
	Sessions = require("./sessions");

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);


var usersSchema = new mongoose.Schema({

	id: {type: String, unique: true, 'default': shortid.generate},
	fullname: {type: String, require: true},
	password: {type: String, require: true},
	email: {type: String, require: true},
	dp: String,
	phone: {
		country_code: String,
		number: String
	},
	bio: String,
	address: String,
	zip_code: String,
	town: String,
	acct_no: String,
	bank_name: String,
	bank_statement: {
		bucket: String,
		object: String
	},
	id_card: {
		bucket: String,
		object: String
	},
	verified: {type: Boolean, 'default': false},
	updated_at: {type: Date,'default': Date.now}
});

var Users = mongoose.model('Users',usersSchema);//intialize data model instance

var tempUsersSchema = new mongoose.Schema({
	id: {type: String, unique: true},
	fullname: {type: String, require: true},
	password: {type: String, require: true},
	email: {type: String, require: true}
});

var TempUsers = mongoose.model('TempUsers',tempUsersSchema);

//setup module exports

var exports = module.exports;

exports.users_model = Users;

exports.check_param_exists = function(param,callback){//check if email or phone number is in use

	var status = false;//set response flag

	Users.findOne({$or:[{email: param},{phone: param}]},function(error,data){
		if(data){
			status = true
		}else{
			status = false;
		}

		callback(status)

	});
}

exports.login = function(requestBody,response){
	response.data = {};//set response array

	var email =  requestBody.email,//email variable
		password = requestBody.password;//password variable

	Users.findOne({$and: [{email: email},{password: password}]},{password:false, _id:false},function(error,data){
		if(error){
			console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
				return;
			}

		}else{
			if(data){
				var folder_setup = true;//assume set up AWS folder structure
				if (folder_setup) {
					//create session
					var session_id = shortid.generate();

					Sessions.create(session_id,data.id,function(session_generate){

						if(session_generate){
							response.writeHead(201,{'Content-Type':'application/json'});
							response.data.log = "Login Success";
							response.data.success = 1;
							response.data.data = data;
							response.data.session_id = session_id;
							response.end(JSON.stringify(response.data));
							return;
						}else{
							response.writeHead(201,{'Content-Type':'application/json'});
							response.data.log = "Error setting up";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
							return;							
						}
					}); 
				}else{
					response.writeHead(201,{'Content-Type':'application/json'});
					response.data.log = "Error setting up";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));		
					return;			
				}
			}else{	
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Invalid login";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
				return;
			}

		}

	})

}

exports.register = function(requestBody,response){
	response.data = {};

	var email = requestBody.email,//email variable
		fullname = requestBody.fullname,//fullname variable
		password = requestBody.password;//password variable

		//Check if email exists 
		Users.findOne({email: email},function(error,data){
			if(error){
				if(response!=null){
					response.writeHead(500,{'Content-Type':'application/json'});//set response type
					response.data.log = "Internal server error";//log response
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}
			}else{
				if(data){
					response.writeHead(201,{'Content-Type':'application/json'});//set response type
					response.data.log = "User exists";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}else{

					var user_key = shortid.generate();
					var TempUser = toTempuser(user_key,email,fullname,password);

					TempUser.save(function(error){
						if(error){
							if(response!=null){
								response.writeHead(500,{'Content-Type':'application/json'});//set response type
								response.data.log = "Internal server error";//log response
								response.data.success = 0;
								response.end(JSON.stringify(response.data));
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
							            email: email,
							          },
							        ],
							        subject: 'Startupia account validation! Do not reply',
							      },
							    ],
							    from: {
							      email: 'accounts@startupia.com',
							    },
							    content: [
							      {
							        type: 'text/html',
							        value: "Validate your startupia account by clicking <a href='https://startupia-api.herokuapp.com/user/confirm/"+user_key+"'>here</a>",
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
			}
		});		
}

exports.confirm_user = function(uniq_id,response){
	TempUsers.findOne({id: uniq_id},function(error,data){
		response.data = {};
		if(error){//if error returned
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type' : 'text/plain'});//server response is in text format
				response.end("Internal server error");
			}
		}else{
			if(data){
				var User = toUser(data.email,data.fullname,data.password);

				User.save(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type' : 'text/plain'});//server response is in text format
							response.end("Internal server error");
						}
					}else{
						data.remove();//delete data instance
						response.writeHead(201,{'Content-Type' : 'text/plain'});//server response is in text format
						response.end("User email confirmed");
					}
				})
			}else{
				response.writeHead(200,{'Content-Type' : 'text/plain'});//server response is in text format
				response.end("Link does not exist");
			}
		}
	});
}

exports.edit = function(requestBody,response){
	response.data = {};//set response array
	Users.findOne({id:requestBody.user_id},function(error,data){
		if(error){//if error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				if(requestBody.type == "Fullname"){
					data.fullname = requestBody.param;
				}else if(requestBody.type == "Address"){
					data.address = requestBody.param;
				}else if(requestBody.type == "Zip-code"){
					data.zip_code = requestBody.param;
				}else if(requestBody.type == "Town"){
					data.town = requestBody.param;
				}else if(requestBody.type == "Dp"){
					data.dp = requestBody.param;
				}else if (requestBody.type == "Bio") {
					data.bio = requestBody.param;
				}else if (requestBody.type == "Acct_no"){
					data.acct_no = requestBody.param;
				}else if (requestBody.type == "Bank_name"){
					data.bank_name = requestBody.param;
				}

				data.save(function(error){
					if(error){
						if(response==null){//check for error 500
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = requestBody.type+" updated";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});			
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "User doesn't exist";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

function toTempuser(id,email, fullname, password){
	return new TempUsers({
		id: id,
		email: email,
		fullname: fullname,
		password: password
	});
}

function toUser(email,fullname,password){
	return new Users({
		email: email,
		fullname: fullname,
		password: password,
		dp: "modules/accounts/img/material/avatar.jpg"
	});
}