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
	}
});


var verifications = mongoose.model('verifications',verifySchema)
var exports = module.exports;

exports.create_for_phone = function(requestBody,response){
	response.data = {};//set data response array
	var key = shortid.generate();
	var Verification = toVerifications(requestBody,key);
		Verification.save(function(error){
			if(error){
				if(response==null){
					response.writeHead(500,{'Content-Type':'application/json'});
					response.data.log = "Internal server error";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}
			}else{
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Verification Message sent";
				response.data.success = 1;
				response.end(JSON.stringify(response.data));
			}
		});
}


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