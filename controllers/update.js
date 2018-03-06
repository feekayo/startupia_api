var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    Personnel = require('../models/personnel'),
    Interviews = require('../models/interview'),
    UserCVs = require('../models/user_cvs'),
	CRM_apps = require('../models/CRM/apps'),
	CRM_products = require('../models/CRM/products');


module.exports = {
    personnel_verification: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.personnel_email!=undefined)&&(request.body.startup_id!=undefined) && (request.body.user_email!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR2", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Personnel.validate_personnel(request.body,response); 
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
    
    job_invite: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.invite_id!=undefined) && (request.body.user_email!=undefined) && (request.body.message!=undefined) && (request.body.bucket!=undefined) && (request.body.object_key!=undefined) && (request.body.position_title!=undefined) && (request.body.non_compete!=undefined) && (request.body.startup_id!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Personnel.update_invite(request.body,response); 
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
    
    user_cv: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.max_education!=undefined) && (request.body.max_education!="") && (request.body.introduction_video_url!=undefined) && (request.body.introduction_video_url!="") && (request.body.cover_letter!=undefined) && (request.body.cover_letter!="") && (request.body.date_of_birth!=undefined) && (request.body.date_of_birth!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.updateCV(request.body,response);
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
    
    user_social: function(request,response){        
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.platform!=undefined) && (request.body.platform!="") && (request.body.url!=undefined) && (request.body.url!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.updateSocial(request.body,response);
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
    
    admin_terminate_interview: function(request,response){
        if((request.body.application_id!=undefined) && (request.body.application_id!="") && (request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.interview_id!=undefined) && (request.body.interview_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.startup_id!=undefined) && (request.body.startup_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Interviews.admin_terminate_interview(request.body,response); 
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                            response.data.log = "User Unauthorized!";//log message for client
                            response.data.success = 0; // success variable for client
                            response.end(JSON.stringify(response.data)); //send response to client                             
                        }
                    });                    
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
    
    user_terminate_interview: function(request,response){
        if((request.body.application_id!=undefined) && (request.body.application_id!="") && (request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.interview_id!=undefined) && (request.body.interview_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.startup_id!=undefined) && (request.body.startup_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Interviews.user_terminate_interview(request.body,response); 
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