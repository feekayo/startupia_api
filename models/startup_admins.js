var mongoose = require('mongoose'),
	shortid = require('shortid');

var adminsSchema = new mongoose.Schema({//define schema
	id: {type: String, unique: true,'default': shortid.generate},
	startup_id: String,
	user_id: String,
	module: Number //0 for superadmin
});

var adminsSchema = new mongoose.Schema({//define admin schema
	id: {type: String,unique: true,'default': shortid.generate},
	startup_id: String,
	user_id: String,
	module: Number //0 for superadmin
});

var Admins = mongoose.model('startup_admins',adminsSchema);
var exports = module.exports;


exports.model = Admins;

exports.create_callback = function(startup_id,user_id,module,callback){
	//response.data = {};

	Admins.findOne({$and: [{startup_id:startup_id},{module: module}]},function(error,data){//check if module already has an admin
		if(data){//if module is already administered over
			callback(false);
		}else{
			var Admin = toAdmin(startup_id,user_id,module);//create admin instance
			Admin.save(function(error){
				if (error) {
					callback(false);
				}else{
					callback(true);
				}
			});
		}
	});
}

exports.create = function(requestBody,response){
	response.data = {};

	Admins.findOne({$and: [{startup_id:requestBody.startup_id},{module: requestBody.module}]},function(error,data){//check if module already has an admin
		if(data){//if module is already administered over
			response.writeHead(500,{'Content-Type':'application/json'});
			response.data.log = "Module already has an admin";
			response.data.success = 0;
			response.end(JSON.stringify(response.data));	
		}else{
			var Admin = toAdmin(requestBody.startup_id,requestBody.user_id,requestBody.module);//create admin instance
			Admin.save(function(error){
				if(error){
					if (response==null) {
						response.writeHead(500,{'Content-Type':'application/json'});
						response.data.log = "Internal server error";
						response.data.success = 0;
						response.end(JSON.stringify(response.data));
					}
				}else{
					response.writeHead(500,{'Content-Type':'application/json'});
					response.data.log = "Admin created";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}
			});
		}
	});
}

function toAdmin(startup_id,user_id,module){
	return new Admins ({
		startup_id: startup_id,
		user_id: user_id,
		module: module
	});
}