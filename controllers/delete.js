var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	CV = require('../models/cv'),
    Founders = require('../models/founders');
//delete controllers

module.exports = {	
    cv_certificate: function(request,response){
    	if((request.params.session_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.cert_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_certificate(request.body,response)
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 0; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}
    		});
    	}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client     		
    	}
    },
	
	cv_project: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.project_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
 	   			if(validated){
 	   				CV.delete_project(request.body,response);
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}
    },

    cv_job: function(request,response){
     	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.job_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_job(request.body,response)
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}   	
    },

    cv_skill: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.skill_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_skill(request.body,response);
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}
    },

    cv_tool: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.tool_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_tool(request.body,response);
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}    	
    },

    cv_interest: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.interest_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_interest(request.body,response);
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}
    },

   cv_essay: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_essay(request.body,response);
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}   		
   }, 

   cv_social: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.social_id!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.delete_social(request.body,response);
    			}else{
    				response.data = {};
    				response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end.end(JSON.stringify(response.data));//send response to client
    	}	
   },

   founder: function(request,response){
        if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.user_email!=undefined) && (request.body.reason!=undefined) && (request.body.startup_id!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Founders.delete(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 0; //success variable for client
                    response.end(JSON.stringify(response.data));//send response to client
                }
            });
        }else{
            response.data = {};
            response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; //success variable for client
            response.end.end(JSON.stringify(response.data));//send response to client
        }    
   }
}