var mongoose = require('mongoose'),
	shortid = require('shortid'),
	Admins = require('./startup_admins'),
	Memos = require('./company_memos'),
	Users = require('./users');

var foundersSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	startup_id: String,
	user_email: {type:String,required:true},
	confirmed: {type: Boolean},
	deleted: {type: Boolean, 'default': false}
});

var founders = mongoose.model('founders',foundersSchema);

var exports = module.exports;

exports.model = founders;

exports.create_callback = function(startup_data,callback){
	founders.findOne({$and: [{startup_id:startup_data.startup_id},{user_email: startup_data.email}]},function(error,data){	
		if(data){
			data.deleted = false;
			data.save(function(error){
				if (error) {
					callback(false);
				}else{
					callback(true);
				}
			})
		}else{
			console.log(data);
			Founder = toFounder(startup_data);
			Founder.save(function(error){
				if (error) {
					callback(false);
				}else{
					callback(true);
				}
			});
		}
	});
}


exports.startup_founders = function(startup_id,response){
	var pipeline = [{
		$match: {$and: [{startup_id:startup_id},{deleted: !true},{confirmed: true}]}
	},{
		$lookup: {
			from: "users",
			localField: "user_email",
			foreignField: "email",
			as: "personal"
		}
	},{
		$project:{
			id: 1,
			user_email: 1,
			confirmed: 1,
			personal:{
				id: 1,
				fullname: 1,
				bio: 1,
				dp: 1
			}
		}
	}]

	response.data = {};//init data array
	founders.aggregate(pipeline,function(error,data){
		if(error){
			if(response==null){//catch error 500
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && Object.keys(data).length!=0){
				console.log(data);
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Data fetched";
				response.data.success = 1;
				response.data.data = data;
				response.end(JSON.stringify(response.data));					
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Oddly, No Founder Listed";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	})
}

exports.delete = function(requestBody,response){
	response.data = {};//set response array
	
	function doStuff(){
		//Check if founder exists
		founders.findOne({$and: [{startup_id:requestBody.startup_id},{user_email: requestBody.user_email}]},function(error,data){//check if user inputted is already a founder of startup	
			console.log(requestBody);
			if(error){	
				if(response==null){
					response.writeHead(500,{'Content-Type':'application/json'});
					response.data.log = "Internal server error";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}			
			}else{
				if (data) {
					Memos.add(requestBody.reason,"Removed a founder",requestBody.user_id,requestBody.startup_id,function(memo){//send a memo about the deletion
						if(!memo){
							response.writeHead(200,{'Content-Type':'application/json'});
							response.data.log = "Founder Removed";
							response.data.success = 1;
							response.end(JSON.stringify(response.data));
						}else{
							data.deleted = true;
							data.save(function(error){
								if (error) {
									if(response==null){
										response.writeHead(500,{'Content-Type':'application/json'});
											response.data.log = "Internal server error";
											response.data.success = 0;
											response.end(JSON.stringify(response.data));
									}
								}else{
									response.writeHead(201,{'Content-Type':'application/json'});
									response.data.log = "Founder Removed";
									response.data.success = 1;
									response.end(JSON.stringify(response.data));
								}
							});
						}
					});	
				}else{
					response.writeHead(201,{'Content-Type':'application/json'});
					response.data.log = "User Unauthorized";
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				}					
			}
		});
	}


	//Check if user is authorized to delete a founder
	Admins.model.findOne({$and: [{user_id: requestBody.user_id},{module:0},{startup_id:requestBody.startup_id}]},function(error,mata){//check whether user is permitted to do action
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{

			if(mata){//if session user is authorized
				doStuff();
			}else{
				Users.users_model.findOne({$and: [{id: requestBody.user_id},{email: requestBody.user_email}]},function(error,fata){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0; // 
							response.end(JSON.stringify(response.data));
							return;
						}						
					}else{
						if(fata){
							doStuff();
						}else{
							//check if user is the owner of invite
							response.writeHead(200,{'Content-Type':'application/json'});
							response.data.log = "User Unauthorized"
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}
				});
			}
		}
	});
}

exports.create = function(requestBody,response){
	response.data = {};//set response data array
	Admins.model.findOne({$and: [{user_id: requestBody.user_id},{module:0},{startup_id:requestBody.startup_id}]},function(error,data){//check whether user is permitted to do action
		if(error){
			if(response==null){//checking for error 500
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0; // 
				response.end(JSON.stringify(response.data));
				return;
			}
		}else{
			if(data){//if user is permitted 
				founders.findOne({$and: [{startup_id:requestBody.startup_id},{user_email: requestBody.email}]},function(error,data){//check if user inputted is already a founder of startup	
					if(data){//if user is already listed as a founder 
						data.deleted = false;
						data.save(function(error){
							if (error) {
								response.writeHead(500,{'Content-Type':'application/json'});//set response type
								response.data.log = "Internal server error";//log message to client
								response.data.success = 0;//success variable for client
								response.end(JSON.stringify(response.data));//send data to client
								return;//return control
							}else{
								response.writeHead(201,{'Content-Type':'application/json'});//set response type
								response.data.log = "Founder Re-Added";//message to client
								response.data.success = 1;//success flag
								response.end(JSON.stringify(response.data));//send data to client
								return;//exit, return control
							}
						});
					}else{
						Founder = toFounder(requestBody);
						Founder.save(function(error){//create user
							if (error) {
								if(response==null){//checking for error 500
									response.writeHead(500,{'Content-Type':'application/json'});//set response type
									response.data.log = "Internal server error";//log message to client
									response.data.success = 0;//success variable for client
									response.end(JSON.stringify(response.data));//send data to client
									return;//return control
								}
							}else{
								response.writeHead(201,{'Content-Type':'application/json'});//set response type
								response.data.log = "Founder Added";//message to client
								response.data.success = 1;//success flag
								response.end(JSON.stringify(response.data));//send data to client
								return;//exit, return control
							}
						});
					}
				});
			}else{//if user lacks permission
				response.writeHead(200,{'Content-Type':'application/json'});//set response type
				response.data.log = "You are unauthorized to perform operation";//message to client
				response.data.success = 0;//failure flag
				response.end(JSON.stringify(response.data));//send data to client
				return;//exit, return control
			}
		}
	});
}

function toFounder(data){
	console.log(data);
	return new founders({
		startup_id: data.startup_id,
		user_email: data.email,
		confirmed: data.boolean
	});
}