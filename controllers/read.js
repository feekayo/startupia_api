var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    UserCVs = require('../models/user_cvs'),
	Personnel = require('../models/personnel'),
	Vacancies = require('../models/vacancies'),
	Interviews = require('../models/interview'),
	CRM_apps = require('../models/CRM/apps'),
	CRM_products = require('../models/CRM/products'),
	url = require('url');

module.exports = {
    
    validate_startup_access: function(request,response){
        var get_params = url.parse(request.url,true);
        if((Object.keys(get_params.query).length==3) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined) && (get_params.query.startup_id)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Privileges.validate_startup_access(get_params.query.user_email,get_params.query.startup_id,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    validate_hr_access: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==3) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined) && (get_params.query.startup_id)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Privileges.validate_hr_access(get_params.query.user_email,get_params.query.startup_id,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    
    validate_fm_access: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==3) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined) && (get_params.query.startup_id)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Privileges.validate_fm_access(get_params.query.user_email,get_params.query.startup_id,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    
    fetch_user_startups: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Startups.fetch_user_startups(get_params.query,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    user_personnel_invites: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Personnel.fetch_user_invites(get_params.query.user_email,response);
                }else{ 
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    user_founder_invites: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Startups.fetch_user_invites(get_params.query.user_email,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    personnel_invite: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_id!=undefined)&& (get_params.query.invite_id!=undefined)){
            
            Sessions.validate(request.params.session_id, get_params.query.user_id,function(validated){
                if(validated){
                    Personnel.fetch_personnel_invite(get_params.query,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    user_privilege_invites: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_id!=undefined)&& (get_params.query.user_email!=undefined)){
            Sessions.validate_email(request.params.session_id, get_params.query.user_id,get_params.query.user_email,function(validated){
                if(validated){
                    Privileges.fetch_user_invites(get_params.query.user_email,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    unvalidated_staff: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==3) && (get_params.query.user_id!=undefined) && (get_params.query.user_email!=undefined) && (get_params.query.startup_id!=undefined)){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Personnel.fetch_unvalidated_staff(get_params.query,response); 
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
            
        }
    },
    
    startup_details: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_id!=undefined)&& (get_params.query.startup_id!=undefined)){
            Sessions.validate(request.params.session_id, get_params.query.user_id,function(validated){
                if(validated){
                    Startups.startup_details(get_params.query,response);
                }else{
                    response.data = {};
                    response.writeHead(200,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid Session";//log message for client
                    response.data.success = 2; // success variable for client
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
    
    startup_job_invites: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==3) && (get_params.query.user_id!=undefined) && (get_params.query.user_email!=undefined) && (get_params.query.startup_id!=undefined)){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Personnel.fetch_startups_job_invites(get_params.query,response); 
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
            
        }
    },
    
	/**crm_fetch_apps: function(request,response){
		if(request.body.company_id!=undefined){
			CRM_apps.fetch_apps_callback(request.body.company_id,function(apps){
				if(apps){
					response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "Apps Fetched";//log message for client
		            response.data.apps = apps;
		            response.data.success = 1; // success variable for client
		            response.end(JSON.stringify(response.data)); //send response to client 	
				}else{
		            response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "No Apps";//log message for client
		            response.data.apps = {};
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

	crm_fetch_products: function(request,response){
		if(request.body.company_id!=undefined){
			CRM_products.fetch_products_callback(request.body.company_id,function(products){
				if(apps){
		            response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "Products ";//log message for client
		            response.data.apps = products;
		            response.data.success = 1; // success variable for client
		            response.end(JSON.stringify(response.data)); //send response to client 
				}else{
		            response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "No products";//log message for client
		            response.data.apps = {};
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

	crm_track_orders: function(request,response){
		if(request.body.product_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_products.fetch_orders(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_app_stats: function(request,response){
		console.log(request.body.app_id);
		if(request.body.app_id!=undefined){
			//response.data = {};
			//CRM_apps.fetch_app_data(request.body,response);


			response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Data Fetched";//log message for client
            response.data.clicks = 10;
            response.data.buttons = 2;
            response.data.success = 1; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_live_app_usage: function(request,response){
		if(request.body.app_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_apps.fetch_live_app_usage(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_fetch_near_misses: function(request,response){
		if(request.body.product_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_products.fetch_near_misses(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_fetch_product_views: function(request,response){
		if(request.body.product_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_products.fetch_product_views(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},**/

	startup_founders_queue: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.startup_id!=undefined){
			Startups.fetch_founders_queue(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},
    
	startup_founders: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.startup_id!=undefined){
			Startups.startup_founders(get_params.query.startup_id,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	startup_personnel: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.startup_id!=undefined){
			Startups.startup_personnel(get_params.query.startup_id,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},
    
    user_cv: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!=undefined){
			UserCVs.fetch_user_cv(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}        
    },
    
    user_certificates: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!=undefined){
			UserCVs.fetch_user_certificates(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}        
    },    
    
    user_skills: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!=undefined){
			UserCVs.fetch_user_skills(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}        
    },    
    
    user_tools: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!=undefined){
			UserCVs.fetch_user_tools(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}        
    },    
    
    user_socials: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!=undefined){
			UserCVs.fetch_user_socials(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}        
    },    
    
    admin_interview_room: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.interview_id!=undefined) && (get_params.query.interview_id!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Interviews.fetch_admin_interview(get_params.query,response); 
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
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },
    
    
    user_interview_room: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((get_params.query.application_id!=undefined) && (get_params.query.application_id!="") (get_params.query.user_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.interview_id!=undefined) && (get_params.query.interview_id!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
                if(validated){
                    Interviews.fetch_user_interview(get_params.query,response); 
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
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },    
    
    startup_vacancies: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Vacancies.fetch_startup_vacancies(get_params.query,response); 
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
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }        
    }
} 