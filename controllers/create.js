var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    Personnel = require('../models/personnel');
	CRM_apps = require('../models/CRM/apps'),
	CRM_products = require('../models/CRM/products');


module.exports = {
	/**crm_create_app: function(request,response){
		console.log(request.body);
		if((request.body.company_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.user_email!=undefined)&&(request.body.app_name!=undefined)&&(request.body.app_category!=undefined)){//add session variable in later update
		
			//check  session
			Privileges.validate_privilege(request.body.user_email,request.body.company_id,'CRM','1', function(valid){
				//requires admin access to CRM 
				if(valid){
					CRM_apps.create_app(request.body,response);
				}else{
					response.data = {};
		            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
		            response.data.log = "Invalid Request"; //log message for client
		            response.data.success = 0;//success variable for client
		            response.end(JSON.stringify(response.data));//send response to client 					
				}
			});
		}else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 
		}
	},

	crm_create_button: function(request,response){
		console.log(request.body);
		if((request.body.company_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.user_email!=undefined)&&(request.body.app_id!=undefined)&&(request.body.button_id!=undefined)&&(request.body.button_desc!=undefined)){//add session variable in later update
		
			//check  session
			Privileges.validate_privilege(request.body.user_email,request.body.company_id,'CRM','1', function(valid){
				//requires admin access to CRM 
				if(valid){
					CRM_apps.validate_app(request.body.app_id,request.body.company_id,function(validated){
						if(validated){
							CRM_apps.create_button(request.body,response);
						}else{
							response.data = {};
				            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
				            response.data.log = "Invalid Request"; //log message for client
				            response.data.success = 0;//success variable for client
				            response.end(JSON.stringify(response.data));//send response to client 
						}	
					})
					
				}else{
					response.data = {};
		            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
		            response.data.log = "Invalid Request"; //log message for client
		            response.data.success = 0;//success variable for client
		            response.end(JSON.stringify(response.data));//send response to client 					
				}
			});
		}else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 
		}
	},

	crm_create_click: function(request,response){
		var ip = request.connection.remoteAddress || request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.socket.remoteAddress;
        if((request.body.app_id!=undefined)&&(request.body.user_email!=undefined)&&(request.body.button_id!=undefined)){//add session variable in later update
		
			//CRM_apps.validate_button(request.body.app_id,request.body.button_id,function(validated){
				//if(validated){
					response.data = {};
					CRM_apps.create_click(ip,request.body,response);
				//}else{
				//	response.data = {};
	        	 //   response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
	        	  //  response.data.log = "Invalid Request"; //log message for client
	        	    //response.data.success = 0;//success variable for client
	        	    //response.end(JSON.stringify(response.data));//send response to client 
				//}	
			//});
		}else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 
		}
	},

	crm_create_product: function(request,response){
		console.log(request.body);
		if((request.body.company_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.user_email!=undefined)
		&&(request.body.product_id!=undefined)&&(request.body.product_name!=undefined)&&(request.body.product_category_id!=undefined)
		&&(request.body.product_price!=undefined)&&(request.body.product_currency!=undefined) ){//add session variable in later update
		
			//check  session
			Privileges.validate_privilege(request.body.user_email,request.body.company_id,'CRM','1', function(valid){
				//requires admin access to CRM 
				if(valid){
					console.log("1");
					CRM_products.create_product(request.body,response);
				}else{
					response.data = {};
		            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
		            response.data.log = "Invalid Request"; //log message for client
		            response.data.success = 0;//success variable for client
		            response.end(JSON.stringify(response.data));//send response to client 					
				}
			});
		}else{
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 
		}	
	},

	crm_create_order: function(request,response){
		var ip = request.connection.remoteAddress || request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.socket.remoteAddress;
        console.log(ip);

        if((request.body.client_email!=undefined)&&(request.body.platform_id!=undefined)&& (request.body.product_id!=undefined) && (request.body.status!=undefined)){
	        	CRM_products.create_order(ip,request.body,response);//create order
    	}else{
 			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client   		
    	}
	},

	crm_create_product_view: function(request,response){
		var ip = request.connection.remoteAddress || request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.socket.remoteAddress;
        console.log(ip);

        if((request.body.client_email!=undefined)&&(request.body.platform_id!=undefined)&& (request.body.product_id!=undefined)){
	        	CRM_products.create_product_view(ip,request.body,response);//create order
    	}else{
 			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client   		
    	}
	},

	crm_create_near_miss: function(request,response){
		var ip = request.connection.remoteAddress || request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.socket.remoteAddress;
        console.log(ip);

        if((request.body.client_email!=undefined)&&(request.body.platform_id!=undefined)&& (request.body.product_id!=undefined)){
	        	CRM_products.create_near_miss(ip,request.body,response);//create order
    	}else{
 			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client   		
    	}
	},

	crm_create_campaign: function(request,response){

	},
    **/
    
    save_startup: function(request,response){
		if((request.body.user_id!=undefined) && (request.body.name!=undefined) && (request.body.email!=undefined) && (request.body.type_id!=undefined) && (request.body.user_email!=undefined) && (request.body.bucket!=undefined) && (request.body.object_key!=undefined)  && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.name!="") && (request.body.email!="") && (request.body.type_id!="") && (request.body.user_email!="") && (request.body.bucket!="") && (request.body.object_key!="")  && (request.params.session_id!="")){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				Startups.save_startup_queue(request.body,response); 
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

	create_startup: function(request,response){
		if((request.body.user_id!=undefined) && (request.body.id!=undefined) && (request.body.user_email!=undefined) && (request.body.user_id!="") && (request.body.id!="") && (request.body.user_email!="")){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				Startups.create_startup(request.body,response); 
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}
    		});
		}else{
            console.log(request.body);
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 			
		}
	},

	create_founder: function(request,response){
		if((request.body.user_id!=undefined) && (request.body.startup_id!=undefined) && (request.body.email!=undefined) && (request.body.startup_name!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.startup_id!="") && (request.body.email!="") && (request.body.startup_name!="") && (request.params.session_id!="")){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				Startups.save_founder_invite(request.body,response); 
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
    
    accept_founder_invite: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.invite_id!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.invite_id!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Startups.confirm_founder(request.body,response);
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

	create_personnel: function(request,response){ //requires write access to personnel creation (HR1)
		if((request.body.user_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined) && (request.body.personnel_email!=undefined) && (request.body.startup_name!=undefined) && (request.body.non_compete!=undefined) && (request.params.session_id!=undefined)&&(request.body.user_id!="") && (request.body.user_email!="") && (request.body.startup_id!="") && (request.body.personnel_email!="") && (request.body.startup_name!="") && (request.body.non_compete!="") && (request.params.session_id!="")){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            console.log(request.body.personnel_email);
                            Personnel.create_personnel(request.body,response); 
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

    accept_personnel_invite: function(request,response){//requires session email verification
        if((request.body.invite_id!=undefined) && (request.body.user_id!=undefined) && (request.body.personnel_email!=undefined) && (request.body.object_key!=undefined) && (request.body.bucket!=undefined) && (request.body.invite_id!="") && (request.body.user_id!="") && (request.body.personnel_email!="") && (request.body.object_key!="") && (request.body.bucket!="")){
          Sessions.validate_email(request.params.session_id,request.body.user_id,request.body.personnel_email,function(validated){
    			if(validated){
                    Personnel.save_personnel(request.body,response);    				
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
    
	create_privilege: function(request,response){
		if((request.body.user_id!=undefined) && (request.body.startup_id!=undefined) && (request.body.startup_name!=undefined) && (request.body.email!=undefined) && (request.body.compartment!=undefined) && (request.body.access_level!=undefined) && (request.body.description!=undefined) && (request.body.user_id!="") && (request.body.startup_id!="") && (request.body.startup_name!="") && (request.body.email!="") && (request.body.compartment!="") && (request.body.access_level!="") && (request.body.description!="")){
			Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
    				Privileges.create_privilege(request.body,response); 
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Invalid session";//log message for client
            		response.data.success = 2; // success variable for client
            		response.end(JSON.stringify(response.data)); //send response to client    				
    			}				
			});
		}else{
            console.log(request.body);
			response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client			
		}
	},

    accept_privilege_invite: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.invite_id!=undefined) && (request.params.session_id!=undefined) && (request.body.user_id!="") && (request.body.invite_id!="") && (request.params.session_id!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Privileges.save_privilege(request.body,response);
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