var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
    Personnel = require('../models/personnel'),
    Vacancies = require('../models/vacancies'),
    Projects = require('../models/projectManagement/projects'),
    Interviews = require('../models/interview'),
    UserCVs = require('../models/user_cvs'),
    TeamMembers = require('../models/projectManagement/teammembers'),
    Teams = require('../models/projectManagement/teams'),
    TeamMessages = require('../models/projectManagement/teammessages'),
    Tasks = require('../models/projectManagement/tasks');


module.exports = {
	 
    save_startup: function(request,response){
		if((request.body.user_id!=undefined) &&
            (request.body.name!=undefined) &&
            (request.body.email!=undefined) &&
            (request.body.type_id!=undefined) &&
            (request.body.user_email!=undefined) &&
            (request.body.bucket!=undefined) &&
            (request.body.object_key!=undefined)  &&
            (request.params.session_id!=undefined) &&
            (request.body.user_id!="") &&
            (request.body.name!="") &&
            (request.body.email!="") &&
            (request.body.type_id!="") &&
            (request.body.user_email!="") &&
            (request.body.bucket!="") &&
            (request.body.object_key!="")  &&
            (request.params.session_id!="")){
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

    add_staff_to_department: function(request,response){
        if((request.body.user_email!="")&&(request.body.user_email!="") && (request.body.startup_id!="")&&(request.body.personnel_email!="")&&(request.body.department_code)&&(request.body.personnel_user_id)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Personnel.create_staff_assignment(request.body.startup_id,request.body.personnel_email,request.body.department_code,function(returned){
                                if(returned==0){
                                    //exists
                                    response.data = {};
                                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                                    response.data.log = "User already in department!";//log message for client
                                    response.data.success = 0; // success variable for client
                                    response.end(JSON.stringify(response.data)); //send response to client 
                                }else if(returned==1){
                                    response.data = {};
                                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                                    response.data.log = "An Error Occured";//log message for client
                                    response.data.success = 0; // success variable for client
                                    response.end(JSON.stringify(response.data)); //send response to client 
                                }else if(returned==2){//successfully completed

                                    Teams.fetch_compartment_team_id(request.body.startup_id,request.body.department_code,function(team_id){
                                        if(team_id){
                                            TeamMembers.add_member_departments(request.body.personnel_user_id,team_id,false,function(added){
                                                if(added){
                                                    response.data = {};
                                                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                                                    response.data.log = "Successfully Added Staff to "+request.body.department_code;//log message for client
                                                    response.data.success = 1; // success variable for client
                                                    response.end(JSON.stringify(response.data)); //send response to client
                                                }else{
                                                    response.data = {};
                                                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                                                    response.data.log = "An Error Occured!!!";//log message for client
                                                    response.data.success = 0; // success variable for client
                                                    response.end(JSON.stringify(response.data)); //send response to client                                                    
                                                }
                                            });
                                        }else{
                                            response.data = {};
                                            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                                            response.data.log = "An Error Occured!";//log message for client
                                            response.data.success = 0; // success variable for client
                                            response.end(JSON.stringify(response.data)); //send response to client                                             
                                        }
                                    });
                                }
                            })
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
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
            console.log(request.body)
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


    
    create_vacancy: function(request,response){ //requires write access to vacancy creation (HR3)
		if((request.body.user_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined) && (request.body.position_title!=undefined) && (request.body.job_description!=undefined)&& (request.body.min_experience!=undefined)&& (request.body.age_limit!=undefined)&& (request.body.min_education!=undefined)&& (request.body.open_positions!=undefined) && (request.body.user_id!="") && (request.body.user_email!="") && (request.body.startup_id!="") && (request.body.position_title!="") && (request.body.job_description!="")&& (request.body.min_experience!="")&& (request.body.age_limit!="")&& (request.body.min_education!="")&& (request.body.open_positions!="")){
    		Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            console.log(request.body.personnel_email);
                            Vacancies.create_vacancy(request.body,response); 
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
    
    save_vacancy: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined) && (request.body.vacancy_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!="") && (request.body.startup_id!="") && (request.body.vacancy_id!="")){
			Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Vacancies.save_vacancy(request.body,response); 
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
	create_vacancy_skill: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined) && (request.body.vacancy_id!=undefined) && (request.body.skill!=undefined) && (request.body.user_id!="") && (request.body.user_email!="") && (request.body.startup_id!="") && (request.body.vacancy_id!="") && (request.body.skill!="")){
			Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Vacancies.save_vacancy_skills(request.body,response); 
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
    
	create_vacancy_tool: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_email!=undefined) && (request.body.startup_id!=undefined) && (request.body.vacancy_id!=undefined) && (request.body.tool!=undefined) && (request.body.user_id!="") && (request.body.user_email!="") && (request.body.startup_id!="") && (request.body.vacancy_id!="") && (request.body.tool!="")){
			Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
    			if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can create personnel
                        if(validated){
                            Vacancies.save_vacancy_tools(request.body,response); 
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
            //console.log(request.body);
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
    },



    
    user_cv: function(request,response){        
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.max_education!=undefined) && (request.body.max_education!="") && (request.body.introduction_video_url!=undefined) && (request.body.introduction_video_url!="") && (request.body.cover_letter!=undefined) && (request.body.cover_letter!="") && (request.body.date_of_birth!=undefined) && (request.body.date_of_birth!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.addCV(request.body,response);
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
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.certificate_name!=undefined) && (request.body.certificate_name!="") && (request.body.certificate_type!=undefined) && (request.body.certificate_type!="") && (request.body.specialization!=undefined) && (request.body.specialization!="") && (request.body.year!=undefined) && (request.body.year!="") && (request.body.bucket!=undefined) && (request.body.bucket!="") && (request.body.object!=undefined) && (request.body.object!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.addCertificate(request.body,response);
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
       if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.name!=undefined) && (request.body.name!="") && (request.body.proof_url!=undefined) && (request.body.proof_url!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    console.log("bleh");
                    UserCVs.addSkill(request.body,response);
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
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.name!=undefined) && (request.body.name!="") && (request.body.proof_url!=undefined) && (request.body.proof_url!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    UserCVs.addTool(request.body,response);
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
                    UserCVs.addSocial(request.body,response);
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
    
    admin_interview_file: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.startup_id!=undefined) && (request.body.startup_id!="") && (request.body.bucket!=undefined) && (request.body.bucket!="") &&(request.body.object!=undefined) && (request.body.object!="") ){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){//validate session
                if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR1", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Interviews.admin_add_file(request.body,response); 
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
    
    user_interview_file: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.application_id!=undefined) && (request.body.application_id!="") && (request.body.bucket!=undefined) && (request.body.bucket!="") && (request.body.object!=undefined) && (request.body.object!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){//validate session
                if(validated){
                    Interviews.user_add_file(request.body,response);                    
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
    
    admin_interview_message: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.user_email!=undefined) && (request.body.user_email!="") && (request.body.startup_id!=undefined) && (request.body.startup_id!="") && (request.body.application_id!=undefined) && (request.body.application_id!="") && (request.body.message!=undefined) && (request.body.message!="") && (request.body.files_attached!=undefined) && (request.body.files_attached!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){//validate session
                if(validated){
                    Privileges.validate_access('HR',request.body.user_email,request.body.startup_id, 0, "HR3", function(validated){//0 here means someone wif root access can also fetch invites
                        if(validated){
                            Interviews.admin_create_message(request.body,response); 
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
    
    user_interview_message: function(request,response){
        if((request.body.user_id!=undefined) && (request.body.user_id!="") && (request.body.application_id!=undefined) && (request.body.application_id!="") && (request.body.message!=undefined) && (request.body.message!="") && (request.body.files_attached!=undefined) && (request.body.files_attached!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){//validate session
                if(validated){
                    Interviews.user_create_message(request.body,response);                    
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

    compartment_create_privilege: function(request,response){
        if((request.body.user_email!=undefined) && (request.body.user_id!=undefined) && (request.body.startup_id!=undefined) && (request.body.startup_name!=undefined) && (request.body.email!=undefined) && (request.body.compartment!=undefined) && (request.body.access_level!=undefined) && (request.body.description!=undefined) && (request.body.user_id!="") && (request.body.startup_id!="") && (request.body.startup_name!="") && (request.body.email!="") && (request.body.compartment!="") && (request.body.access_level!="") && (request.body.description!="") && (request.body.user_email!="")){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Privileges.validate_root_access(request.body.compartment,request.body.user_email,request.body.startup_id,function(validated){
                        if(validated){
                            Privileges.create_privilege(request.body,response);         
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                            response.data.log = "Only The Head of "+request.body.compartment+" can access this function";//log message for client
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
            //console.log(request.body);
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client           
        }
    },
    
    /**
    PRODUCT DEVELOPMENT
    */
    //admin_compartment_workspace_membership
    
    create_compartment_project: function(request,response){
        if(request.body.startup_id!=undefined && request.body.startup_id!="" && request.body.user_id!=undefined && request.body.user_id!=""){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                        //create HR TEAM & Workspace
                        Projects.create_compartment_projects('Human Resources', 'HR', request.body.startup_id,function(created){
                            if(created){

                                //Create FM Team and Workspace
                                Projects.create_compartment_projects('Financial Management', 'FM', request.body.startup_id,function(created){
                                    if(created){

                                        //Create PD Team and Workspace
                                        Projects.create_compartment_projects('Product Development', 'PD', request.body.startup_id,function(created){
                                            if(created){
                                                //Create CRM WORKSPACE
                                                //CREATE ADVERTISMENT WORKSPACE
                                                //CREATE PRODUCT MONITORING WORKSPACE
                                                response.data = {};
                                                response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                                                response.data.log = "Successfully initialted Workspaces"; //log message for client
                                                response.data.success = 1;//success variable for client
                                                response.end(JSON.stringify(response.data));//send response to client 
                                            }else{
                                                response.data = {};
                                                response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                                                response.data.log = "Failed to Create PD Root Workspaces"; //log message for client
                                                response.data.success = 0;//success variable for client
                                                response.end(JSON.stringify(response.data));//send response to client                                         
                                            }
                                        });
                                    }else{
                                        response.data = {};
                                        response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                                        response.data.log = "Failed to Create FM Root Workspace"; //log message for client
                                        response.data.success = 0;//success variable for client
                                        response.end(JSON.stringify(response.data));//send response to client                                         
                                    }
                                });
                            }else{
                                response.data = {};
                                response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                                response.data.log = "Failed to Create HR Root Workspace"; //log message for client
                                response.data.success = 0;//success variable for client
                                response.end(JSON.stringify(response.data));//send response to client 
                            }
                        });
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_project: function(request,response){
            
        if(request.body.primary_project!="" && request.body.parent_project!="" && request.body.depth!="" && request.body.project_name!="" && request.body.startup_id!="" && request.body.user_id!="" && request.body.team_id!="" && request.body.parent_team!="" && request.body.primary_project!=undefined && request.body.parent_project!=undefined && request.body.depth!=undefined && request.body.project_name!=undefined && request.body.startup_id!=undefined && request.body.user_id!=undefined && request.body.team_id!=undefined && request.body.parent_team!=undefined){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    request.body.department_code = "HR";
                    TeamMembers.validate_department_access(request.body,function(validated){
                        if(validated){
                            Projects.create_project(request.body,response);
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "User Unauthorized"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client                             
                        }
                    })
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_team: function(request,response){
        if(true){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    /**Privileges.validate_access(function(validated){
                        Teams.create_team(request.body,response);
                    })***/
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_admin: function(request,response){
       if(request.body.user_id!="" && request.body.team_id!="" && request.body.member_id!="" && request.body.user_id!=undefined && request.body.team_id!=undefined && request.body.member_id!=undefined){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    TeamMembers.validate_admin(request.body.team_id, request.body.user_id,function(validated){
                        if(validated){
                            TeamMembers.add_admin(request.body,response)
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Incomplete data"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client 	                            
                        }
                    })
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_teammember: function(request,response){
        if(true){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    /**Privileges.validate_access(function(validated){
                        Teams.create_team(request.body,response);
                    })***/
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_teammessage: function(request,response){
        if(request.body.user_id!="" && request.body.team_id!="" && request.body.topic_id!="" && request.body.message_id!="" && request.body.message!="" && request.body.user_id!=undefined && request.body.team_id!=undefined && request.body.topic_id!=undefined && request.body.message_id!=undefined && request.body.message!=undefined){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    TeamMembers.validate_membership(request.body.team_id,request.body.user_id,function(member){
                        if(member){
                            TeamMessages.create_message(request.body,response);
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Access Denied!"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client                             
                        }
                    });
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_task: function(request,response){
        if(true){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    /**Privileges.validate_access(function(validated){
                        Teams.create_team(request.body,response);
                    })***/
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_task_note: function(request,response){
        if(request.body.task_id!="" && request.body.user_id!="" && request.body.note!="" && request.body.task_id!=undefined && request.body.user_id!=undefined && request.body.note!=undefined){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    TeamMembers.validate_membership(request.body.team_id,request.body.user_id,function(member){
                        if(member){
                            Tasks.create_task_note(request.body,response);
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Access Denied!"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client                             
                        }
                    })
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_project_resource: function(request,response){
        if(request.body.user_id!="" && request.body.project_id!="" && request.body.url!="" && request.body.description!="" &&  request.body.type!="" && request.body.user_id!=undefined && request.body.project_id!=undefined && request.body.url!=undefined && request.body.description!=undefined &&  request.body.type!=undefined){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    TeamMembers.validate_membership(request.body.team_id,request.body.user_id,function(member){
                        if(member){
                            Projects.create_project_link(request.body,response);
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Access Denied!"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client                             
                        }
                    })
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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
    },
    
    create_project_topic: function(request,response){
        if(request.body.user_id!="" && request.body.team_id!="" && request.body.project_id!="" && request.body.topic!="" && request.body.description!="" && request.body.user_id!=undefined && request.body.team_id!=undefined && request.body.project_id!=undefined && request.body.topic!=undefined && request.body.description!=undefined){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    TeamMembers.validate_membership(request.body.team_id,request.body.user_id,function(member){
                        if(member){
                            TeamMessages.create_topic(request.body,response);
                        }else{
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Access Denied!"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client                             
                        }
                    })
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid session"; //log message for client
                    response.data.success = 2;//success variable for client
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