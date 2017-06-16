var mongoose = require('mongoose'),
	shortid = require('shortid');
	Founders = require('./founders'),
	Admins = require('./startup_admins');

var startupsSchema = new mongoose.Schema({//define schema
	id: {type: String,unique: true},
	token: {type: String,unique: true}, 
	logo: String,
	name: {type:String},
	type_id: String,
	url: String,
	phone_no: String,
	email: String,
	inc_document: {
		bucket: String,
		object: String
	},
	address: String,
	town: String,
	bank_name: String,
	bank_statement: {
		bucket: String,
		object: String
	},
	verification_status: {type:Number,'default':0} //0 for unverified, 1 for pending, 2 for verified 
});

var startups = mongoose.model('startups',startupsSchema);//define model

var exports = module.exports;

exports.create = function(requestBody,response){
	response.data = {};//define response array

	var pipeline =[{
		$match: {name: requestBody.name}
	}];//expand pipeline later on
	startups.aggregate(pipeline,function(error,data){//check is user is already a fouder in existing startup with same name
		if(error){
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}			
		}else{
			if (data && (Object.keys(data).length!=0)) {
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Startup exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var token = requestBody.name.replace(/\s+/g,"_").toLowerCase();//replace all spaces and ' in string with -s
				var startup_id = shortid.generate();
				var Startup = toStartups(requestBody,token,startup_id);

				Startup.save(function(error){//save startup
					if(error){
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						var foundersData = {};
						foundersData.startup_id = startup_id;
						console.log(foundersData.startup_id);
						foundersData.email = requestBody.email;
						foundersData.boolean =  true;

						Founders.create_callback(foundersData,function(created){
							if (created) {
								Admins.create_callback(startup_id,requestBody.user_id,0,function(superadmined){
									if(superadmined){
										response.writeHead(201,{'Content-Type':'application/json'});
										response.data.log = "Startup setup";
										response.data.success = 1;
										response.data.token = token;
										response.end(JSON.stringify(response.data));
									}else{
										response.writeHead(200,{'Content-Type':'application/json'});
										response.data.log = "Error setting up";
										response.data.success = 0;
										response.end(JSON.stringify(response.data));										
									}
								});
							}else{
								response.writeHead(200,{'Content-Type':'application/json'});
								response.data.log = "Error setting up";
								response.data.success = 0;
								response.end(JSON.stringify(response.data));
							}
						});
					}
				});
			}
		}
	})
}

exports.update = function(requestBody,response){
	response.data = {};
	Admins.model.findOne({$and: [{user_id: requestBody.user_id},{startup_id:requestBody.startup_id},{module: 0}]},function(error,data){//check if session user is super admin
		if(error){//if error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//report error 500
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));				
			}
		}else{//if no error
			if(data) { //if data is found
				startups.findOne({id: requestBody.startup_id},function(error,edata){//fetch startup data
					console.log(requestBody.startup_id);
					if(error){//if error in fetching startup data
						if(response==null){	//check for error 500
							response.writeHead(500,{'Content-Type':'application/json'});//report error 500
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{//if no error in fetching startup data

						if(edata) {//if startup data is fetched
							if (requestBody.type=='Name') {//reset parameter
								edata.name = requestBody.param;
								console.log
							}else if(requestBody.type == 'Logo'){
								edata.logo = requestBody.param;
							}else if(requestBody.type == 'Url'){
								edata.url = requestBody.param;
							}else if(requestBody.type == 'Category'){
								edata.type_id = requestBody.param;
							}

							edata.save(function(error){//save parameter
								if(error){//check for error in saving
									if(response==null){//check for error 500
										response.writeHead(500,{'Content-Type':'application/json'});//report error 500
										response.data.log = "Internal server error";
										response.data.success = 0;
										response.end(JSON.stringify(response.data));
									}
								}else{//if no error
									response.writeHead(201,{'Content-Type':'application/json'});//send server response
									response.data.log = "Company "+requestBody.type+" updated";
									response.data.success = 1;
									response.end(JSON.stringify(response.data));
								}
							});
						}else{
							response.writeHead(200,{'Content-Type':'application/json'});//if no startup data is found
							response.data.log = "Startup non-existent?";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}
				});
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});//if user aint admin dont permit him to make changes
				response.data.log = "User Unauthorized";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.fetch_startup_setup = function(requestBody,response){//for fetching startup data
	response.data = {};//set response aaray

	startups.findOne({token: requestBody.token},function(error,data){//aggregate data pipeline
		if(error){
			if(response==null){//catch error 500
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && Object.keys(data).length!=0){//if user data is fetched
				Founders.model.findOne({$and: [{user_email:requestBody.email},{startup_id: data.id},{deleted: false}]},function(error,idata){//check if session user is permitted on dashboard
					if(error){
						if(response==null){//catch error 500
							response.writeHead(500,{'Content-Type':'application/json'});//set response type
							response.data.log = "Internal server error";//return error message to client
							response.data.success = 0;//error flag
							response.end(JSON.stringify(response.data));//send data to frontend
						}
					}else{
						if(idata){//if session user is a founder
							Admins.model.findOne({$and: [{startup_id: data.id},{user_id: requestBody.user_id},{module:0}]},function(error,edata){
								if(error){
									if(response==null){//catch error 500
										response.writeHead(500,{'Content-Type':'application/json'});//set response type
										response.data.log = "Internal server error";//return error message to client
										response.data.success = 0;//error flag
										response.end(JSON.stringify(response.data));//send data to frontend
									}
								}else{
									response.writeHead(201,{'Content-Type':'application/json'});//set response type
									if(edata){
										response.data.admin = true;//set user as admin
									}else{
										response.data.admin = false;//user aint no admin brah
									}
									response.data.log = "Data fetched";//send success message to client
									response.data.success = 1;//success flag
									response.data.data = data;//startup data
									response.end(JSON.stringify(response.data));//send data to front									
								}

							});
						}else{
							response.writeHead(200,{'Content-Type':'application/json'});
							response.data.log = "User Unauthorized";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));							
						}
					}
				});					

			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Startup no longer exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});

}

function toStartups(data,token,id){
	return new startups({
		id: id,
		token: token,
		name: data.name,
		logo: 'modules/accounts/img/material/bgiii.png',
		url: data.company_url,
		type_id: data.type_id
	});
}