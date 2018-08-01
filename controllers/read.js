var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    UserCVs = require('../models/user_cvs'),
	Personnel = require('../models/personnel'),
	Vacancies = require('../models/vacancies'),
	Interviews = require('../models/interview'),
    Logs = require('../models/logs'),
    Projects = require('../models/projectManagement/projects'),
    Teams = require('../models/projectManagement/teams'),
    TeamMembers = require('../models/projectManagement/teammembers'),
    TeamMessages = require('../models/projectManagement/teammessages'),
    Tasks = require('../models/projectManagement/tasks');    
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
    
    validated_staff: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==3) && (get_params.query.user_id!=undefined) && (get_params.query.user_email!=undefined) && (get_params.query.startup_id!=undefined)){
            Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
                if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Personnel.fetch_validated_staff(get_params.query,response); 
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
        
        if((get_params.query.application_id!="") && (get_params.query.application_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.interview_id!="") && (get_params.query.interview_id!=undefined)){
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
        
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.user_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
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
    },
    
    vacancy_applicants: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((get_params.query.user_email!=undefined) && (get_params.query.user_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="")  && (get_params.query.vacancy_id!=undefined) && (get_params.query.vacancy_id!="") && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Vacancies.fetch_vacancy_applicants(get_params.query,response); 
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
    
    user_applications : function(request,response){
var get_params = url.parse(request.url,true);
        if((get_params.query.page_number!=undefined) && (get_params.query.page_number!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){    			
                if(validated){
                    Vacancies.fetch_user_applications(get_params.query,response); 
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Access Denied";//log message for client
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
    
    startup_employees: function(request,response){
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_id!=undefined) && (get_params.query.user_id!="") &&(get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Personnel.fetch_startup_personnel(get_params.query,response); 				
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
    
    general_work_logs: function(request,response){
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Logs.fetch_startup_logs(get_params.query,response); 
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
    
    compartment_work_logs: function(request,response){
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.compartment!="") && (get_params.query.compartment!=undefined) && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Logs.fetch_compartment_logs(get_params.query,response);
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
    
    user_logs: function(request,response){
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="")){
    		Sessions.validate_email(request.params.session_id,get_params.query.user_id,get_params.query.user_email,function(validated){    			
                if(validated){
                    Logs.fetch_user_logs(get_params.query,response); 
    			}else{
            		response.data = {};
            		response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            		response.data.log = "Access Denied";//log message for client
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
    
    user_company_work_logs: function(request,response){
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.personnel_email!=undefined) && (get_params.query.personnel_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
    
            Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR4", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Logs.fetch_user_company_work_logs(get_params.query,response); 
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
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client               
        }
    }, 
    
    user_company_compartment_work_logs: function(request,response){
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.personnel_email!=undefined) && (get_params.query.personnel_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.compartment!="") && (get_params.query.compartment!=undefined) && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR4", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Logs.fetch_user_compartment_work_logs(get_params.query,response); 
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
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client               
        }
    },     
    
    project_work_logs: function(request,response){ //NOT HR3 Privilege required
        var get_params = url.parse(request.url,true);
        if((get_params.query.user_email!=undefined) && (get_params.query.user_email!="") && (get_params.query.startup_id!=undefined) && (get_params.query.startup_id!="") && (get_params.query.user_id!=undefined) && (get_params.query.user_id!="") && (get_params.query.project_id!="") && (get_params.query.project_id!=undefined) && (get_params.query.page_number!=undefined) && (get_params.query.page_number!="")){
    		Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',get_params.query.user_email,get_params.query.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Logs.fetch_user_project_work_log(get_params.query,response); 
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
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client               
        }
    }, 

    skill_jobs: function(request,response){

        console.log('hat')        
        var get_params = url.parse(request.url,true);

        if((get_params.query.skill_id != "") && (get_params.query.page_number != "") && (params.query.skill_id != undefined) && (get_params.query.page_number=undefined)){
            /**
            var skill_id = get_params.query.skill_id,
                page_number = get_params.query.page_number;
        
            Vacancies.fetch_skill_vacancies(skill_id,page_number,response);    
            **/
            console.log("fooliz")
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },

    skill_vacancies: function(request,response){
        
        var get_params = url.parse(request.url,true);
        if(get_params.query.skill_id!="" && get_params.query.page_number!="" && get_params.query.skill_id!=undefined && get_params.query.page_number!=undefined){
            Vacancies.fetch_skill_vacancies(get_params.query.skill_id,get_params.query.page_number,response);               
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client             
        }

    },

    department_privileged: function(request,response){
        
        var get_params = url.parse(request.url,true);
        if(get_params.query.user_id!="" && get_params.query.startup_id!="" && get_params.query.department_code!="" && get_params.query.user_id!=undefined && get_params.query.startup_id!=undefined && get_params.query.department_code!=undefined){
            Sessions.validate(request.params.session_id,get_params.query.user_id,function(validated){
                if(validated){
                    Privileges.fetch_department_privileged(get_params.query,response);
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
    
    /**
        PRODUCT DEVT CONTROLLERS
    */
    
    fetch_compartment_team: function(request,response){//fetch all the staffers of a compartment team
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!="" && get_params.query.startup_id!="" && get_params.query.department_code!="" && get_params.query.user_id!=undefined && get_params.query.startup_id!=undefined && get_params.query.department_code!=undefined){
			Teams.fetch_compartment_team_id(get_params.query.startup_id,get_params.query.department_code,function(team_id){
				if(team_id){
					TeamMembers.fetch_team_members(team_id,function(team_members){
						if(team_members){
				            response.data = {};
				            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
				            response.data.log = "Team Fetched"; //log message for client
				            response.data.data = team_members;
				            response.data.success = 1;//success variable for client
				            response.end(JSON.stringify(response.data));//send response to client							
						}
					})
				}else{
		            response.data = {};
		            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
		            response.data.log = "Team not found"; //log message for client
		            response.data.success = 0;//success variable for client
		            response.end(JSON.stringify(response.data));//send response to client 					
				}
			})
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 			
		}
	}

} 