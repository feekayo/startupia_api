//tasks
//id
//user_id
//project_id
//created_by
//created_at
//updated
//deadline
//status: pending/complete

var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Sessions = require('../sessions'),
    Log = require('../logs');
    
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var tasksSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id: {type: String, require: 'true'},
    description: {type: String, require: 'true'},
    project_id: {type: String, require: 'true'},
    startup_id: {type: String, require: 'true'},
    created_at: {type: Date, require: 'true'},
    updated_at: {type: Date, 'default': Date.now},
    team_id: {type: String, require: 'true'},
    deadline: {type: Date, require: 'true'},
    status: {type: String, require: 'true', 'default': 'fresh'} //fresh, ongoing, completed
});

var taskNotesSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    task_id: {type: String, require: 'true'},
    user_id: {type: String, require: 'true'},
    note: {type: String, require: 'true'},
    created_at: {type: Date, 'default': Date.now}
})

var TaskNotes = mongoose.model('tasknotes',taskNotesSchema);

var Tasks = mongoose.model('tasks',tasksSchema);

var exports = module.exports;

exports.create_task = function(requestBody,response){
    
    response.data = {};
    
    var Task = toTask(requestBody);
    
    Task.save(function(error){
        if(error){
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
            
            //log task creation
            response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Task Added";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement                
        }
    })
}

exports.read_project_tasks = function(requestBody,response){
    
    response.data = {};
    
}

exports.read_task = function(requestBody,response){
    
    response.data = {};
    
}

exports.update_task_status = function(requestBody,response){
    
    response.data = {};
    
    Tasks.findOne({id: requestBody.task_id},function(error,data){ //find task
        if(error){
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
            if(data){ //if task is found
                //save task note first
                data.status = requestBody.status; //update status
                
                data.save(function(error){//save update
                    if(error){
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
                        
                        //log task saving
                        
                        response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Task Updated";//log message for client
                        response.data.success = 0;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                         
                    }       
                })
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Task not found";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                   
            }
        }
    });    
}

exports.update_task_description = function(requestBody,response){
    
    response.data = {};
    
    Tasks.findOne({id: requestBody.task_id},function(error,data){ //find task
        if(error){
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
            if(data){ //if task is found
                //save task note first
                data.description = requestBody.description; //update task
                
                data.save(function(error){//save update
                    if(error){
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
            
                        //log task update
                        
                        response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Task Updated";//log message for client
                        response.data.success = 0;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                         
                    }       
                })
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Task not found";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                   
            }
        }
    });
}

exports.delete_project_tasks = function(project_id,callback){
    Tasks.remove({project_id: project_id},function(error){
        if(error){
            callback(false);
        }else{
            callback(true);
        }
    });
}

exports.realign_tasks = function(parent_project,project_id,callback){
    
    Tasks.update({project_id:project_id},{$set: {project_id: parent_project}},function(error){
        if(error){
            callback(false);
        }else{
            callback(true);
        }
    })
}

exports.reassign_tasks_to_projects = function(task_id, project_id, callback){
    
    Tasks.update({id: task_id},{$set: {project_id: project_id}},function(error){
        if(error){
            callback(false)
        }else{
            callback(true)
        }
    })
}

exports.delete_task = function(requestBody,response){
    
    response.data = {};
    
    Tasks.remove({id: requestBody.task_id},function(error){//find task and remove it
        if(error){
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
            
            //log task deletion
            
            response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Task Deleted";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })
}


exports.create_task_note = function(requestBody,response){
    
    response.data = {};
    
    var TaskNote = toTaskNote(requestBody);
    
    TaskNote.save(function(error){
        if(error){
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
            
            //log task creation
            response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Task Added";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement                
        }
    })    
}

exports.update_task_note = function(requestBody,response){
    
    response.data = {};
    
    TaskNotes.findOne({id: requestBody.note_id},function(error,data){ //find task
        if(error){
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
            if(data){ //if task is found
                //save task note first
                data.note = requestBody.note; //update task
                
                data.save(function(error){//save update
                    if(error){
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
            
                        //log task update
                        
                        response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Note Updated";//log message for client
                        response.data.success = 0;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                         
                    }       
                })
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Note not found";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                   
            }
        }
    });    
}

exports.delete_task_note = function(requestBody,response){
    
    response.data = {};
    
    TaskNotes.remove({id: requestBody.note_id},function(error){//find task and remove it
        if(error){
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
            
            //log task deletion
            
            response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Note Deleted";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })    
}

exports.read_task_notes = function(requestBody,response){
    
}

function toTask(data){
    return new Tasks({
        user_id: data.user_id,
        project_id: data.project_id,
        startup_id: data.startup_id,
        created_at: Date.now(),
        team_id: data.team_id,
        deadline: data.deadline
    })
}

function toTaskNote(data){
    return new TaskNotes({
        task_id: data.task_id,
        user_id: data.user_id,
        note: data.note,        
    })
}