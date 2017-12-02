var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    Personnel = require('../models/personnel');
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
    }

} 