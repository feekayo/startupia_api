var mongoose = require('mongoose'),
	shortid = require('shortid'),
	Privileges = require('./privileges');

//var sendgrid = require("sendgrid")("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");
var sendgrid = require("sendgrid")(process.env.SENDGRID_API_KEY);

/**Startup Section**/

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
		object_key: String
	},
    founders_agreement: {
        bucket: String,
        object_key: String
    },
    address: String,
	town: String,
	country: String,
    zip_code: String,
	verification_status: {type:Number,'default':0} //0 for unverified, 1 for pending, 2 for verified 
});


var Startups = mongoose.model('startups',startupsSchema);

var startupQueueSchema = new mongoose.Schema({
    id: {type: String,unique:true},
    url_optimizer: {type: String},
    name: String,
    email: String,
    //type_id: String,
    url: String,
    founders_agreement: {
        bucket: String,
        object_key: String
    },
    /**address: String,
    town: String,
    country: String,
    zip_code: String**/
});


var StartupsQueue = mongoose.model('startupsQueue',startupQueueSchema);
var exports = module.exports;

exports.save_startup_queue = function(requestBody,response){
    response.data = {};
    var token = shortid.generate();//generate unique token
    
    var url_optimizer = requestBody.name;
    
    url_optimizer = url_optimizer.replace(/[^A-Z0-9]+/ig,'-');
    
    var StartupQueue = toStartupQueue(requestBody,token,url_optimizer);//save startup to startup queue
    
    StartupQueue.save(function(error){//save queue
        if(error){//if error
 			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.data = {};
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }                         
        }else{
            
            requestBody.startup_id = token;
            var FounderInvite = toFoundersInvite(requestBody,shortid.generate());//create founder invite
            console.log(requestBody);
            FounderInvite.save(function(error){//save session user as a founder invite
                if(error){//if error
                    console.log(error);//log error
                    if(response==null){//check for error 500
                        response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Internal server error";//log message for client
                        response.data.success = 0;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement
                    }else{
                        response.data = {};
                        response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Database Error";//log message for client
                        response.data.success = 0;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                
                    }                                      
                }else{//if no error
                    response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                    response.data.log = "Startup Queued!";//log message for client
                    response.data.startup_id= token;//return startup_id
                    response.data.success = 1;//success flag
                    response.end(JSON.stringify(response.data));//send response to client 
                    return;//return statement
                }
            });
        }
    });
}

exports.create_startup = function(requestBody,response){
    var id = requestBody.id;//the startup id
    response.data = {};//set response array
    
    StartupsQueue.findOne({id: id},function(error,data){ //check if startup exists on queue
       if(error){//if error in checking for item on queue
           
           console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//log message for client
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client
				return;//return statement
            }else{
                response.data = {};
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }                            
       } else{
           if(data){
               var Startup = toStartup(data);//create a new startup from queue data
                
               Startup.save(function(error){//save startup from queue
                   if(error){//if error in saving queue
                        console.log(error);//log error
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal server error";//log message for client
                            response.data.success = 0;//flag success
                            response.end(JSON.stringify(response.data));//send response to client
                            return;//return statement
                        }else{
                            response.data = {};
                            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                            response.data.log = "Database Error";//log message for client
                            response.data.success = 0;//flag success
                            response.end(JSON.stringify(response.data));//send response to client
                            return;//return statement                
                        }                                        
                   }else{
                       data.remove(function(error){//remove data in queue
                           if(error){//if error in deleting queue data
                                console.log(error);//log error
                                if(response==null){//check for error 500
                                    response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Internal server error";//log message for client
                                    response.data.success = 0;//flag success
                                    response.end(JSON.stringify(response.data));//send response to client
                                    return;//return statement
                                }else{
                                    response.data = {};
                                    response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                                    response.data.log = "Database Error";//log message for client
                                    response.data.success = 0;//flag success
                                    response.end(JSON.stringify(response.data));//send response to client
                                    return;//return statement                
                                }                                                
                           }else{
                               FoundersInvite.findOne({$and: [{startup_id: id},{user_email:requestBody.user_email}]},function(error,data){//fetch session user's invite
                                   if(error){//if error in fetching data
                                        console.log(error);//log error
                                        if(response==null){//check for error 500
                                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                            response.data.log = "Internal server error";//log message for client
                                            response.data.success = 0;//flag success
                                            response.end(JSON.stringify(response.data));//send response to client
                                            return;//return statement
                                        }else{
                                            response.data = {};
                                            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                                            response.data.log = "Database Error";//log message for client
                                            response.data.success = 0;//flag success
                                            response.end(JSON.stringify(response.data));//send response to client
                                            return;//return statement                
                                        }                                                     
                                   }else{
                                       if(data){
                                           data.startup_id = id;//set startup_id
                                           var Founder = toFounders(data);//save data from queue
                                                                                           
                                           Founder.save(function(error){//if error in saving
                                               if(error){//if error
                                                    console.log(error);//log error
                                                    if(response==null){//check for error 500
                                                        response.writeHead(500,{'Content-Type':'application/json'});//setcontent resolution variables
                                                        response.data.log = "Internal server error";//log message for client
                                                        response.data.success = 0;//flag success
                                                        response.end(JSON.stringify(response.data));//send response to client
                                                        return;//return statement
                                                    }else{
                                                        response.data = {};
                                                        response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                                                        response.data.log = "Database Error";//log message for client
                                                        response.data.success = 0;//flag success
                                                        response.end(JSON.stringify(response.data));//send response to client
                                                        return;//return statement                
                                                    }                  
                                               }else{
                                                   data.remove();//delete associated data
                                                   response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                                                   response.data.log = "Startup saved!";//log message for client
                                                   response.data.success = 1;//flag success
                                                   response.end(JSON.stringify(response.data));//send response to client
                                                   return;//return statement                                                   
                                               }
                                           })
                                       }else{
                                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                            response.data.log = "Setup failed!"
                                            response.data.success = 0;
                                            response.end(JSON.stringify(response.data));
                                            return;                                              
                                       }
                                   }
                               })
                               
                           }
                       })
                   }
               })
           }
       }
    });
}


exports.fetch_startup_data = function(requestBody,response){
    response.data = {};
    
    Startups.findOne({id:id},function(error,data){
        if(error){
 			console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
				return;
			}else{
                response.data = {};
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }                             
        }else{
            if(data){
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Data Fetched";
				response.data.success = 1;
                response.data.data = data;
				response.end(JSON.stringify(response.data));
				return;                   
            }else{
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "No Data";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));                
            }
        }
    })
}


/**
    End Startup Part
**/


/**

Founder Part

**/


var foundersQueueSchema = new mongoose.Schema({//define Schema
	id: {type: String, unique: true},
	startup_id: {type:String,required:true},
    founders_agreement:{
        bucket: {type:String,required:true},
        object_key: {type:String,required:true}
    },
	user_email: {type:String,required:true}
});

var FoundersInvite = mongoose.model('founders_invites',foundersQueueSchema);

var foundersSchema = new mongoose.Schema({//define Schema
	id: {type: String, unique: true, 'default': shortid.generate},
	startup_id: String,
	founders_agreement_url: String,
    user_email: {type:String,required:true}
});

var Founders = mongoose.model('founders',foundersSchema);

exports.save_founder_invite = function(requestBody,response){
    
    response.data = {};//set response array
    
    var id = shortid.generate();
    var Invite = toFoundersInvite(requestBody,id);
    
    Invite.save(function(error){
        if(error){//if error in saving
            console.log(error);//log error
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Internal server error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }              
        }else{
            //send email
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
				       subject: 'Founder Invite Sent',
				     },
				   ],
				   from: {
				     email: 'founders@startupia.io',
				   },
				   content: [
				     {
				       type: 'text/html',
				       value: "You have received an invite to Join a Startup as a Founder. Click here for more detaials <a href='https://startupia-frontend.herokuapp.com/startups/founder_invites/"+id+"'>DETAILS</a>"
				     },
				   ],
				 },
            });
			//With callback
			sendgrid.API(request, function(error, qresponse) {
                response.data = {};
                if (error) {
				 	console.log(error);
				    //send email here
					response.writeHead(200,{'Content-Type':'application/json'});//set response type
					response.data.log = "Trouble Sending Invite";//log response
					response.data.success = 0;
					response.end(JSON.stringify(response.data));
				 }else{
				    //send email here
					response.writeHead(201,{'Content-Type':'application/json'});//set response type
					response.data.log = "Invite sent to Co-Founder";//log response
					response.data.success = 1;
					response.end(JSON.stringify(response.data));
				}
            });	            
        }
    });
}

exports.fetch_founder_invite = function(requestBody,response){
    FoundersInvite.findOne({id:requestBody.id},function(error,data){
       if(error){
            console.log(error);//log error
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Internal server error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }                          
       }else{
           if(data){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Data fetched";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;//founder data 
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement               
           }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "No Data";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
           }
       } 
    });
}

exports.fetch_founders_queue = function(requestBody,response){
    response.data = {};//init data array
    console.log(requestBody.startup_id);
    var aggregate = [{
        $match: {startup_id: requestBody.startup_id}
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "founder_info"
        }
    },{
        $project: {
            id: 1,
            startup_id: 1,
            founders_agreement:{
                bucket: 1,
                object_key: 1
            },
            user_email: 1,
            founder_info: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1               
            }
        }
    }];
    
    FoundersInvite.aggregate(aggregate,function(error,data){
       if(error){
           if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Internal server error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            } 
       }else{
           //console.log(Object.keys(data));
           if(data && (Object.keys(data).length!=0)){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Data fetched";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;//founder data 
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement               
           }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "No Data";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
           }
       }
    });
}

exports.confirm_founder = function(requestBody,response){
    FoundersInvite.findOne({id:requestBody.id},function(error,data){
       if(error){
            console.log(error);//log error
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Internal server error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }                          
       }else{
           if(data){
                var Founder = toFounders(data);
               
               Founder.save(function(error){
                   if(error){
                        console.log(error);//log error
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//setcontent resolution variables
                            response.data.log = "Internal server error";//log message for client
                            response.data.success = 0;//flag success
                            response.end(JSON.stringify(response.data));//send response to client
                            return;//return statement
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                            response.data.log = "Database Error";//log message for client
                            response.data.success = 0;//flag success
                            response.end(JSON.stringify(response.data));//send response to client
                            return;//return statement                
                        }                                      
                   }else{
                        response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Fetch Data";//log message for client
                        response.data.success = 1;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                        
                   }
               })
           }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "No Data";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
           }
       } 
    });
}



function generate_token(){
    var uniq_id = shortid.generate(); //Math.floor(Math.random()*(999999-100000+1))+100000;
    Startups.findOne({token: uniq_id},function(error,data){
       if(error){
           generate_token();//generate new token
       }else{
           if(data){
               generate_token();//generate new token
           }else{
               return uniq_id;
           }
       } 
    });
}


function toFoundersInvite(data,id){
    return new FoundersInvite({
        id: id,
        startup_id: data.startup_id,
        founders_agreement:{
            bucket: data.bucket,
            object_key: data.object_key
        }, 
        user_email: data.email        
    });
}

function toFounders(data){
    return new FoundersInvite({
        startup_id: data.startup_id,
        founders_agreement:{
            bucket: data.bucket,
            object_key: data.object_key
        }, 
        user_email: data.user_email        
    });    
}

function toStartupQueue(data,token,url_optimizer){
    return new StartupsQueue({
        id: token,
        url_optimizer: url_optimizer,
        name: data.name,
        email: data.email,
        type_id: data.type_id,
        founders_agreement: {
            bucket: data.bucket,
            object_key: data.object_key
        },
        address: data.address,
        town: data.town,
        country: data.country,
        zip_code: data.zip_code,
        user_id: data.user_id
    })
}

function toStartup(data){
    return new StartupsQueue({
        id: data.id,
        url_optimizer: data.url_optimizer,
        name: data.name,
        email: data.email,
        url: data.website,
        founders_agreement: {
            bucket: data.bucket,
            object_key: data.object_key
        }        
        /**type_id: data.type_id,
        founders_agreement: {
            bucket: data.bucket,
            object_key: data.object_key
        },
        address: data.address,
        town: data.town,
        country: data.country,
        zip_code: data.zip_code**/
    })
}
//function for checking if startup name exists and generates token


/**var foundersSchema = new mongoose.Schema({//define Schema
	id: {type: String, unique: true, 'default': shortid.generate},
	startup_id: String,
	user_email: {type:String,required:true},
	confirmed: {type: Boolean},
	deleted: {type: Boolean, 'default': false},
	identifier: String	
});

var Founders = mongoose.model('founders',foundersSchema);


var personnelSchema = new mongoose.Schema({//define Schema
	id: {type: String, unique: true, 'default': shortid.generate},
	startup_id: String,
	user_email: {type:String,required:true},
	confirmed: {type: Boolean},
	deleted: {type: Boolean, 'default': false},
	identifier: String,
    employment_agreement_url: String
});

var Personnel = mongoose.model('personnel',personnelSchema);
**/


