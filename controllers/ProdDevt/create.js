//create controller deals with everything to do with creating product development tasks and activities

let Sessions = require('../../models/sessions'),
	Users = require('../../models/users'),
	Privileges = require('../../models/privileges'),
	Startups = require('../../models/startups'),
    Personnel = require('../../models/personnel'),
    Projects = require('../../models/projectManagement/projects'),
    Teams = require('../../models/projectManagement/teams'),
    TeamMembers = require('../../models/projectManagement/teammembers'),
    TeamMessages = require('../../models/projectManagement/teammessages'),
    Tasks = require('../../models/projectManagement/tasks');


module.exports = {

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
        if(true){//parameter validation
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    /**Privileges.project_validation(function(validated){
                        Projects.create_project(request.body,response);
                    })**/
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
    
    create_projectlink: function(request,response){
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
    
    /**update_workflow: function(request,response){//remove from here
        
    },**/
    
    
    
    
}