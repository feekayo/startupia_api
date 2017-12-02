var mongoose = require("mongoose"),
	shortid = require("shortid"),
	Sessions = require('./sessions'),
	Users = require('./users'),
    Startups = require('./startups'),
    Personnel = require('./personnel');

var sendgrid = require("sendgrid")(process.env.SENDGRID_API_KEY);

var privilegesSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	company_id: String,
	user_email: String,
	description: String,
    compartment: String, // ROOT, FM, PD, HR, CRM, BP
	access_level: Number, //1: Super Admin, 2: Administrator, 3
    timestamp: {type:Date, 'default': Date.now }
});

var Privileges = mongoose.model('Privileges',privilegesSchema)

var privilegesQueueSchema = new mongoose.Schema({
	id: {type: String, unique: true},
	company_id: String,
	user_email: String,
    description: String,
	compartment: String, // ROOT, FM, PD, HR, CRM, BP
	access_level: Number, //1: Super Admin, 2: Administrator, 3
    timestamp: {type:Date, 'default': Date.now }
});

var PrivilegesQueue = mongoose.model('PrivilegesQueue',privilegesQueueSchema)

var exports = module.exports;

exports.validate_startup_access = function(email,startup_id,response){

    response.data = {};
    
    Startups.founders_model.findOne({$and: [{startup_id: startup_id},{user_email: email}]},function(error,data){
        if(error){
			//console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Database Error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;                
            }             
        }else{
            if(data){
                response.data.general_access = 1;
                //check access parameters
                Privileges.find({$and: [{company_id:startup_id},{user_email:email}]},function(error,data){
                    if(error){
                        //console.log(error);//log error
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal server error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                
                        }                         
                    }else{
                        if(data){
                            /**data.forEach(function(element){
                                //ROOT, FM, PD, HR, CRM, BP
                                if(element.compartment=="ROOT"){
                                    response.data.root_access = true;
                                }else if(element.compartment=="FM"){ 
                                    response.data.fm_access = true;
                                }else if(element.compartment=="PD"){
                                    response.data.pd_access = true;
                                }else if(element.compartment=="HR"){
                                    response.data.hr_access = true;
                                }else if(element.compartment=="CRM"){
                                    response.data.crm_access = true;
                                }else if(element.compartment=="BP"){
                                    response.data.bp_access = true;
                                }
                            });**/
                            
                            for(var i=0; i<data.length; i++){
                                var element = data[i];
                                
                                if(element.compartment=="ROOT"){
                                    response.data.root_access = true;
                                }else if(element.compartment=="FM"){ 
                                    response.data.fm_access = true;
                                }else if(element.compartment=="PD"){
                                    response.data.pd_access = true;
                                }else if(element.compartment=="HR"){
                                    response.data.hr_access = true;
                                }else if(element.compartment=="CRM"){
                                    response.data.crm_access = true;
                                }else if(element.compartment=="BP"){
                                    response.data.bp_access = true;
                                }
                            }
                            response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Access Flags Fetched";//send message to user
                            response.data.success = 1;//success flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return; 
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Limited Access";//send message to user
                            response.data.success = 1;//success flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                              
                        }
                    }
                })
            }else{
                Personnel.personnel_model.findOne({$and: [{personnel_email: email},{startup_id: startup_id},{accepted: true}]},function(error,data){
                    if(error){
                        //console.log(error);//log error
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal server error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                
                        }                         
                    }else{
                        if(data){
                            response.data.general_access = 1;
                            //check access parameters
                            Privileges.find({$and: [{company_id:startup_id},{user_email:email}]},function(error,data){
                                if(error){
                                    //console.log(error);//log error
                                    if(response==null){//check for error 500
                                        response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                        response.data.log = "Internal server error";//send message to user
                                        response.data.success = 0;//failed flag
                                        response.end(JSON.stringify(response.data));//send message to user
                                        return;
                                    }else{
                                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                        response.data.log = "Database Error";//send message to user
                                        response.data.success = 0;//failed flag
                                        response.end(JSON.stringify(response.data));//send message to user
                                        return;                
                                    }                         
                                }else{
                                    if(data){
                                        data.forEach(function(element){
                                            //ROOT, FM, PD, HR, CRM, BP
                                            if(element.compartment=="ROOT"){
                                                response.data.root_access = true;
                                            }else if(element.compartment=="FM"){ 
                                                response.data.fm_access = true;
                                            }else if(element.compartment=="PD"){
                                                response.data.pd_access = true;
                                            }else if(element.compartment=="HR"){
                                                response.data.hr_access = true;
                                            }else if(element.compartment=="CRM"){
                                                response.data.crm_access = true;
                                            }else if(element.compartment=="BP"){
                                                response.data.bp_access = true;
                                            }
                                        });
                                    }else{
                                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                        response.data.log = "Limited Access";//send message to user
                                        response.data.success = 1;//success flag
                                        response.end(JSON.stringify(response.data));//send message to user
                                        return;                              
                                    }
                                }
                            })
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Access Denied!";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                                            
                        }
                    }
                })
            }
        }
    })
}

exports.validate_access = function(compartment,user_email,company_id, root_access, access_level, callback){
    if(root_access==0){
        Privileges.findOne({$and: [{compartment: compartment},{user_email:user_email},{company_id:company_id}, {$or: [{root_access: root_access},{access_level:access_level}]}]},function(error,data){
            if(error){
                console.log(error);
                callback(false);
            }else{
                if(data){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        });
    }else{
        Privileges.findOne({$and: [{compartment: compartment},{user_email:user_email},{company_id:company_id},{access_level:access_level}]},function(error,data){
            if(error){
                console.log(error);
                callback(false);
            }else{
                if(data){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        });        
    }
}

exports.check_privilege_callback = function(user_email,company_id,compartment,callback){
	Privileges.findOne({$and: [{user_email:user_email},{company_id:company_id},{compartment:compartment}]},function(error,data){
		if(data){
			console.log(data);
			var access_level = true;
		}else{
			var access_level = false;
		}
		callback(access_level);
	});
}


exports.validate_privilege = function(user_email,company_id,compartment,required_level, callback){
	Privileges.findOne({$and: [{user_email:user_email},{company_id:company_id},{compartment:compartment},{access_level:required_level}]},function(error,data){
		if(data){
			access = true;
		}else{
			access = false;
		}
		callback(access);
	});	
} 

exports.create_privilege = function(requestBody,response){
    response.data = {};
    
    PrivilegesQueue.findOne({$and: [{company_id:requestBody.startup_id},{compartment:requestBody.compartment},{access_level:requestBody.access_level}]},function(error,data){
       if(error){
			//console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Database Error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;                
            }           
       }else{
           if(data){//if current privilege
                data.remove(function(error){//remove current privilege 
                    if(error){
                        //console.log(error);//log error
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal server error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                
                        }                        
                    }else{
                        var id = shortid.generate();   
                        var Privilege = toPrivilegeQueue(id,requestBody);
                        
                        Privilege.save(function(error){
                            if(error){
                                if(response==null){//check for error 500
                                    response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Internal server error";//send message to user
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;
                                }else{
                                    response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Database Error";//send message to user
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
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
                                            subject: 'Startupia account privileges! Do not reply',
                                          },
                                        ],
                                        from: {
                                          email: 'privileges@startupia.io',
                                        },
                                        content: [
                                          {
                                            type: 'text/html',
                                            value: "You have received an invite for a privileged role at "+requestBody.startup_name+" Click here for more detaials <a href='https://startupia-frontend.herokuapp.com/startups/privilege_invites/"+id+"'>DETAILS</a>"
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
                                        response.data.success = 1;
                                        response.end(JSON.stringify(response.data));
                                      }else{
                                        //send email here
                                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                        response.data.log = "Updated Privileges";//log response
                                        response.data.success = 1;
                                        response.end(JSON.stringify(response.data));
                                      }
                                    });							
                            }                            
                        });
                    }   
                });
            }else{
                var id = shortid.generate();   
                var Privilege = toPrivilegeQueue(id,requestBody);
                        
                Privilege.save(function(error){
                    if(error){
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal server error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                                     
                        }
                    }else{

                        var request = sendgrid.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: {
                            personalizations: [
                                {
                                to: [{
                                   email: requestBody.email,
                                },
                                ],
                                    subject: 'Startupia account privileges! Do not reply',
                                      },
                            ],
                            from: {
                                email: 'privileges@startupia.io',
                            },
                            content: [
                                {
                                    type: 'text/html',
                                    value: "You have received an invite for a Role at "+requestBody.startup_name+". Click here for more details <a href='https://startupia-frontend.herokuapp.com/invites'>DETAILS</a>"
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
                                response.data.success = 1;
                                response.end(JSON.stringify(response.data));
                             }else{
                                //send email here
                                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                response.data.log = "Updated Privileges";//log response
                                response.data.success = 1;
                                response.end(JSON.stringify(response.data));
                            }
                        });							
                    }                            
                });
                
            }
       } 
        
    });
}

exports.save_privilege = function(requestBody,response){

	response.data = {};//set response object
	PrivilegesQueue.findOne({id: requestBody.invite_id},function(error,data){//check if privilege has already been granted to someone else
		if(error){
			//console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			if(data){
				var Privilege = toPrivilege(data);//reset access email
				
				Privilege.save(function(error){
					if(error){
						if(response==null){//check for error 500
							response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
							response.data.log = "Internal server error";//send message to user
							response.data.success = 0;//failed flag
							response.end(JSON.stringify(response.data));//send message to user
							return;
						}else{
							response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
							response.data.log = "Database Error";//send message to user
							response.data.success = 0;//failed flag
							response.end(JSON.stringify(response.data));//send message to user
							return;                            
                        }
					}else{
						response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
						response.data.log = "Privilege Saved";//send message to user
						response.data.success = 0;//failed flag
						response.end(JSON.stringify(response.data));//send message to user
				        return;                          
                    }
                });
                    
            }else{
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Invite non-existent";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
                return;
            }
		}
	});
}

exports.fetch_user_invites = function(user_email,response){
    
    response.data = {};
    
    var aggregate = [{
        $match: {user_email: user_email}
    },{
        $lookup: {
            from: "startups",
            foreignField: "id",
            localField: "startup_id",
            as: "startup_data"
        }   
    }]    
    PrivilegesQueue.aggregate(aggregate,function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));    
            }else{
                console.log(error);
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Database Error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));    
            }
        }else{
            if(data && Object.keys(data).length!=0){
                response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Invites Fetched";
                response.data.data = data;
				response.data.success = 1;
				response.end(JSON.stringify(response.data));    
            }else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "No Active Invite";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));                
            }
        }
    })
}

exports.reject_privilege_invite = function(requestBody,response){
    PersonnelQueue.findOne({id:requestBody.invite_id},function(error,data){
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
               data.remove(function(error){
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
                        response.data.log = "Invite Rejected";//log message for client
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


function toPrivilegeQueue(id,data){
	return new PrivilegesQueue({
        id: id,
		company_id: data.startup_id,
		user_email: data.email,
        description: data.description,
		compartment: data.compartment,
		access_level: data.access_level		
	});
}

function toPrivilege(data){
	return new Privileges({
		company_id: data.startup_id,
		user_email: data.email,
        description: data.description,
		compartment: data.compartment,
		access_level: data.access_level		
	});
}