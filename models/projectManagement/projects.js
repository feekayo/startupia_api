//id
//primary project #can be created by root access holder
//parent project #can be created by team leader
//depth
//project name
//project team
//created_by
//timestamp
//delivery_deadline

var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Sessions = require('../sessions'),
    Teams = require('./teams'),
    Log = require('../logs');
    
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var projectsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true},
    primary_project: {type: String},
    parent_project: {type: String},
    depth: {type: Number},
    project_name: {type: String, require: true},
    startup_id: {type: String,require: true},
    user_id: {type: String},
    team_id: {type: String},
    created_at: {type: Date},
    updated_at: {type: Date, 'default': Date.now}
});

var Projects = mongoose.model('projects',projectsSchema);

var projectsLinkSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    url: {type: String, require: true},
    name: {type: String, require: true},
    created_at: {type: Date, require: true, 'default': Date.now}
});

var ProjectLinks = mongoose.model('ProjectLinks',projectsLinkSchema);

var prioritiesSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    priority: {type: Number, required: true},
    task_id: {type: String},
    project_id: {type: String}
});

var WorkPriority = mongoose.model('WorkPriority', prioritiesSchema);

var exports = module.exports;


exports.create_priority = function(requestBody,response){
    response.data = {};
   /** 
    WorkPriority.findOne({$and: [{priority: requestBody.priority},{project_id: requestBody.project_id}]},function(error,data){
        if(error){
            console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }             
        }else{
            if(data && (Object.keys(data).length>0)){
                //create a update existing priority
                
                WorkPriority.findOne({$and: [{priority: requestBody.priority},{project_id: requestBody.project_id}]},{},{sort: {'priority': -1}},function(error,data){
                    if(error){
                        
                    }else{
                        if(data){
                            
                        }else{
                            
                        }
                    }
                });
                
            }else{
                //create a new priority
                
                
            }
        }
    })**/
}

exports.create_project_link = function(requestBody,response){
    response.data = {};
    
    var Link = toProjectLink(requestBody);
    
    Link.save(function(error){
        if(error){
            console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }              
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Project Link Saved";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }        
    })
}


exports.create_compartment_projects = function(compartment_name,department_code,startup_id,callback){
        
    var data = {};

    project_id = shortid.generate();
    team_id = shortid.generate();
    data.id = project_id;
    data.primary_project = 0,
    data.parent_project = 0,
    data.depth = 0,
    data.project_name = compartment_name+" Management",
    data.startup_id = startup_id;
    data.team_id = team_id;
    
    Projects.findOne({$and: [{project_name: data.project_name},{startup_id: startup_id},{primary_project: 0}]},function(error,edata){
        if(error){
            console.log(error);
            callback(false)
        }else{
            if(edata && Object.keys(edata).length>0){
                callback(false);//abort operation
            }else{
                Project = toProject(data)

                Project.save(function(error){
                    if (error) {
                        callback(false)
                    }else{
                        
                        var tdata = {};

                        tdata.project_id = project_id;
                        tdata.parent_team = 0;
                        tdata.team_name = data.project_name+" Team";
                        tdata.startup_id = startup_id;
                        tdata.compartment = department_code;

                        Teams.create_team_callback(team_id,tdata,function(saved){
                            if(saved){
                                callback(true);//continue operation
                            }else{
                                callback(false);
                            }    
                        })                          
                        
                    }
                })
            }
        }
    })    
}

exports.create_project = function(requestBody,response){
    
    response.data = {};
    requestBody.id = shortid.generate();
    var project = toProject(requestBody);
    
    project.save(function(error){
        if(error){
            console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }              
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Project Saved";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })
    
}

exports.delete_project_realign_children = function(requestBody,response){
    //look up whether project has children before deleting it
    
    Projects.findOne({id: requestBody.project_id},function(error,data){
        if(error){
           console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }                
        }else{
            if(data && Object.keys(data).length>0){
                var parent_id = data.parent_project;
                
                auto_delete_and_realign_projects(true,parent_id,requestBody.project_id,function(refragged){
                    if(refragged==3){
                        response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Root project cannot be deleted in this manner!";//log message for client
                        response.data.success = 0;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                          
                    }else{
                        if(refragged){
                            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                            response.data.log = "Project Deleted; Tree Re-aligned";//log message for client
                            response.data.success = 0;//flag success
                            response.end(JSON.stringify(response.data));//send response to client
                            return;//return statement                              
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                            response.data.log = "Operation Failed";//log message for client
                            response.data.success = 0;//flag success
                            response.end(JSON.stringify(response.data));//send response to client
                            return;//return statement                              
                        }
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Project not found";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                    
            }
        }
    })
}

function auto_delete_and_realign_projects(reset,parent_id,project_id,callback){

    if(parent_id!=0){
        Projects.findOne({id: parent_id},function(error,data){//find parent project
            if(error){
                console.log(error);
                callback(false)
            }else{
                if(data && Object.keys(data).length>0){

                    var depth = parseInt(data.depth)-1;
                    
                    if(data.depth<=6){//terminate if greatest depth reached
                        if(reset){//if we are deleting a data point and resetting it's children's parent
                            Projects.remove({id: project_id},function(error){
                               if(error){
                                   console.log(error);
                                   callback(error);
                               }else{
                                    Projects.update({parent_project: project_id},{$set: {parent_project:data.parent_project}/**,{depth: depth}}**/},function(error){
                                        if(error){
                                            console.log(error);
                                            callback(false);
                                        }else{
                                            console("realigning level: "+depth);
                                            auto_delete_and_realign_projects(false,data.project_id,null,callback);
                                        }
                                    });
                               }
                            });
                        }else{
                            Projects.update({parent_project: parent_id},{$set: {depth: depth}},function(error){
                                if(error){
                                    console.log(error);
                                    callback(false);
                                }else{
                                    console("realigning level: "+depth);
                                    auto_delete_and_realign_projects(false,data.project_id,null,callback);
                                }
                            })                               
                        }
                    }else{
                        callback(true);
                    }
                }else{
                    callback(true);
                }
            }
        })
    }else{
        callback(3);
    }
    
}

exports.delete_project_tree = function(requestBody,response){
    //delete project and all it's children
    
    Projects.remove({$or: [{id: requestBody.project_id},{primary_project: requestBody.primary_project}]},function(error){
       if(error){
           console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }              
       }else{
           
            //delete tasks here
            
            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Project and Subprojects Deleted";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement  
       }
    });
}

exports.read_project = function(requestBody,response){
    
}

exports.read_project_children = function(requestBody,response){
    
}

exports.update_project = function(requestBody,response){
    
}

exports.add_project_team = function(requestBody,response){
    Projects.update({id: requestBody.project_id},{$set: {team_id: requestBody.team_id}},function(error){
        if(error){
           console.log(error);
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error"; //send client log message
				response.data.success = 0;//flag success
				response.end(JSON.stringify(response.data));//send response to client 
				return;//return
			}else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                
            }             
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Team Added";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })
}

function toProject(data){
    return new Projects({
        id: data.id,
        primary_project: data.primary_project,
        parent_project: data.parent_project,
        depth: data.depth,
        project_name: data.project_name,
        startup_id: data.startup_id,
        user_id: data.user_id,
        team_id: data.team_id,
        created_at: Date.now()
    })
}

function toProjectLink(data){
    return new ProjectLinks({
        url: data.url,
        name: data.name
    })    
}