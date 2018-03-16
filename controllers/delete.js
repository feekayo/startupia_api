var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    Personnel = require('../models/personnel'),
    Vacancies = require('../models/vacancies'),
    UserCVs = require('../models/user_cvs'),
	CRM_apps = require('../models/CRM/apps'),
	CRM_products = require('../models/CRM/products');


module.exports = {
    
    reject_founder_invite: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.invite_id!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.invite_id!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Startups.reject_founder_invite(request.body,response);
                }else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client                     
                } 
            });
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }
    },

	
    reject_personnel_invite: function(request,response){//requires session email verification
        if((request.body.user_id!=undefined)&& (request.body.user_id!="") && (request.body.invite_id!=undefined)&& (request.body.invite_id!="") && (request.params.session_id!=undefined) && (request.params.session_id!="")){
          Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Personnel.reject_personnel_invite(request.body,response);    				
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}
    		});  
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }
    },


    reject_privilege_invite: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.invite_id!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.invite_id!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Privileges.reject_privilege_invite(request.body,response);
                }else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client                     
                } 
            });
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }
    },
    
    delete_job_invites: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.invite_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Personnel.delete_invite(request.body,response); 
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                            response.data.log = "User Unauthorized!";//log message for client
                            response.data.success = 0; // success variable for client
                            response.end(JSON.stringify(response.data)); //send response to client                             
                        }
                    })
    				
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}
    		});
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 	
        }        
    },
    
    retract_validation: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.personnel_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined)&& (request.body.message!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR2", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Personnel.retract_validation(request.body,response); 
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                            response.data.log = "User Unauthorized!";//log message for client
                            response.data.success = 0; // success variable for client
                            response.end(JSON.stringify(response.data)); //send response to client                             
                        }
                    })
    				
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}
    		});
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 	
        }        
    },
    
    user_certificate: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.certificate_id!=undefined) && (request.body.user_email!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.certificate_id!="") && (request.body.user_email!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.deleteCertificate(request.body,response);
                }else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client                     
                } 
            });
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }
    },    
    
    user_tool: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.tool_id!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.tool_id!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.deleteTool(request.body,response);
                }else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client                     
                } 
            });
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }
    },
    
    user_skill: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.skill_id!=undefined)&& (request.body.user_email!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.skill_id!="")&& (request.body.user_email!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.deleteSkill(request.body,response);
                }else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client                     
                } 
            });
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }
    },
    
    user_delete_application: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.skill_id!=undefined)&& (request.body.user_email!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.skill_id!="")&& (request.body.user_email!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Vacancies.delete_user_application(request.body,response);
                }else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client                     
                } 
            });
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }        
    },
    delete_vacancy: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.personnel_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined)&& (request.body.vacancy_id!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Vacancies.delete_vacancy(request.body,response); 
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                            response.data.log = "User Unauthorized!";//log message for client
                            response.data.success = 0; // success variable for client
                            response.end(JSON.stringify(response.data)); //send response to client                             
                        }
                    })
    				
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}
    		});
        }else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 	
        }        
    }    
    
} 