var Sessions = require("../models/sessions"),
	Users = require("../models/users"),
	CV = require("../models/cv"),
    Startups = require('../models/startups'),
    Founders = require('../models/founders');

//create controllers

module.exports = {
    cv_certificate: function(request,response){
    	if((request.params.session_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.name!=undefined) && (request.body.field!=undefined) && (request.body.institiution!=undefined)&&(request.body.year!=undefined)&&(request.body.link!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_certificate(request.body,response)
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
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.title!=undefined) && (request.body.version!=undefined) && (request.body.url!=undefined) && (request.body.role!=undefined) && (request.body.project_description!=undefined) && (request.body.release_date!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
 	   			if(validated){
 	   				CV.create_project(request.body,response);
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
     	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.job_description) && (request.body.company_name!=undefined) && (request.body.position!=undefined) && (request.body.start_year!=undefined) && (request.body.end_year!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_job(request.body,response)
    			}else{
    				response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
    				response.data.log = "Invalid session";//log message for client
    				response.data.success = 0; //success variable for client
    				response.end(JSON.stringify(response.data));//send response to client
    			}
    		});
    	}else{
            console.log(request.body);
    		response.data = {};
    		response.writeHead(200,{'Content-Type':'application/json'});//server response is in json format
    		response.data.log = "Incomplete Request";//log message for client
    		response.data.success = 0; //success variable for client
    		response.end(JSON.stringify(response.data));//send response to client
    	}   	
    },

    cv_skill: function(request,response){
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.name!=undefined) && (request.body.url!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_skill(request.body,response);
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
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined)  && (request.body.skill_id) && (request.body.tool!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_tool(request.body,response);
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
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.name!=undefined) && (request.body.url!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_interest(request.body,response);
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
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.essay!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_essay(request.body,response);
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
    	if((request.params.session_id!=undefined) && (request.body.user_id!=undefined) && (request.body.platform!=undefined) && (request.body.url!=undefined)){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				CV.create_social(request.body,response);
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
    		response.end(JSON.stringify(response.data));//send response to client
    	}	
   },

   //create startups
   startups: function(request,response){
        if((request.params.session_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.name!=undefined)&&(request.body.company_url!=undefined)&&(request.body.type_id!=undefined)&&(request.body.email!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Startups.create(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 0;//success variable for client
                    response.end(JSON.stringify(response.data));//send response to client
                }
            });
        }else{
            response.data = {};
            response.writeHead(200,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    },

    //create founders
    founders: function(request,response){
        if((request.params.session_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.startup_id!=undefined)&&(request.body.email!=undefined)&&(request.body.boolean!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Founders.create(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 0;//success variable for client
                    response.end(JSON.stringify(response.data));//send response to client
                }
            });
        }else{
            response.data = {};
            response.writeHead(200,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    }
}