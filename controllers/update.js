var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    Personnel = require('../models/personnel');
	CRM_apps = require('../models/CRM/apps'),
	CRM_products = require('../models/CRM/products');


module.exports = {
    personnel_verification: function(request,response){
        if((request.body.personnel_email!=undefined)&&(request.body.startup_id!=undefined) && (request.body.user_email!=undefined)){
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
    }
}