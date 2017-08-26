var mongoose = require('mongoose'),
	shortid = require('shortid'),
	Users = require('./users');

var verifySchema = new mongoose.Schema({
	id: {type: String, unique:true, 'default': shortid.generate},
	key: String,
	user_id: String,
	data: {
		country_code: String,
		number: String
	},
	email: String
});

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);//include sendgrid API 

var verifications = mongoose.model('verifications',verifySchema)
var exports = module.exports;

exports.create_for_phone = function(requestBody,response){//for sending verification codes to user phone numbers
	response.data = {};//set data response array
	var key = shortid.generate();//generate key
	/**
	Create function for sending key to user phone number 
	**/
	var Verification = toVerifications(requestBody,key);//create database instance
	Verification.save(function(error){//save database instance
		if(error){//check if error in saving database instance
			if(response==null){//if response is null
				response.writeHead(500,{'Content-Type':'application/json'});//set response code to error 500
				response.data.log = "Internal server error";//client message
				response.data.success = 0;//success flag set to failed
				response.end(JSON.stringify(response.data));//send client data
			}
		}else{
			response.writeHead(201,{'Content-Type':'application/json'});//if message was 
			response.data.log = "Verification Message sent";
			response.data.success = 1;
			response.end(JSON.stringify(response.data));
		}
	});
}


exports.create_for_email = function(requestBody,response){//for sending verification codes to user email addresses
	response.data = {};//set data response array
	var key = Math.floor(Math.random()*(999999-100000+1))+100000;

	var Verification = toEmailVerification(requestBody,key);//create database instance
	Verification.save(function(error){//save database instance
		if(error){//check if error in saving database instance
			if(response==null){//if response is null
				response.writeHead(500,{'Content-Type':'application/json'});//set response code to error 500
				response.data.log = "Internal server error";//client message
				response.data.success = 0;//success flag set to failed
				response.end(JSON.stringify(response.data));//send client data
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
							subject: 'Startupia Easy Email Validation! Do not reply',
						},
					],
					
					from: {
					     email: 'verify@startupia.io',
					},
					content: [
						      {
						        type: 'text/html',
						        value: "<h3>Your Easy verification code is</h3><br/> "+key+"</h4><br/><p>Copy </p>",
						      },
						    ],
				},
			});

			//with callback send email
			sendgrid.API(request, function(error,qresponse){
				if (error){
					console.log(error);//log error to console
					response.writeHead(500,{'Content-Type':'application/json'});//set response type
					response.data.log = "Verification code not sent";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}else{
					if (qresponse) {
						response.writeHead(201,{'Content-Type':'application/json'});//if message was set
						response.data.log = "Verification Message sent";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));						
					}else{
						console.log(error);//log error to console
						response.writeHead(500,{'Content-Type':'application/json'});//set response type
						response.data.log = "Something went wrong";
						response.data.success = 0;
						response.end(JSON.stringify(response.data));						
					}
				}
			});

		}
	});

}

exports.confirm_email = function(requestBody,response){
	response.data = {};//set data response array
	verifications.findOne({$and: [{user_id:requestBody.user_id},{key:requestBody.key},{email:requestBody.email}]},function(error,data){
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if (error) {
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Email verified";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Email verified";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));						
					}
				});

			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Invalid Easy verification code";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
},

exports.confirm_phone = function(requestBody,response){
	response.data = {};//set data response array
	verifications.findOne({$and:[{user_id:requestBody.user_id},{key:requestBody.key}]},function(error,data){
		if (error) {
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				var country_code = data.data.country_code;
				var number = data.data.number;

				console.log(country_code+" "+number+" "+requestBody.user_id);
				Users.users_model.findOne({id:requestBody.user_id},function(error,data){
					if (error) {
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						if(data){
							data.phone.country_code = country_code;
							data.phone.number = number;

							data.save(function(error){
								if(error){
									if (response==null) {
										response.writeHead(500,{'Content-Type':'application/json'});
										response.data.log = "Internal server error";
										response.success = 0;
										response.end(JSON.stringify(response.data));
									}
								}else{
									response.writeHead(201,{'Content-Type':'application/json'});
									response.data.log = "Phone Number Verified";
									response.data.success = 1;
									response.end(JSON.stringify(response.data));
								}
							});
						}else{
							response.writeHead(201,{'Content-Type':'application/json'});
							response.data.log = "User doesn't exist";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));	
						}
					}
				});
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Incorrect Pin";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	})
}

function toVerifications(data,key){
	return new verifications({
		key: key,
		user_id: data.user_id,
		type: data.type,
		data: {
			country_code: data.country_code,
			number: data.number
		}
	});

}

function toEmailVerification(data,key){
	return new verifications({
		key: key,
		user_id: data.user_id,
		email: data.email
	})
}