//team
//id
//project_id
//parent_team
//team_name
//created at

var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Sessions = require('../sessions'),
    Log = require('../logs'),
    Members = require('./teammembers');
    
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var teamsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true},
    project_id: {type: String, require: 'true'},
    parent_team: {type: String, require: 'true'},
    team_name: {type: String, require: 'true'},
    created_at: {type: Date, require: 'true'},
    startup_id: {type: String, require: 'true'},
    compartment: {type: String}
});

var Teams = mongoose.model('teams',teamsSchema);

var exports = module.exports;

exports.create_team = function(requestBody,response){
    
    var team_id = shortid.generate();
    
    var Team = toTeams(requestBody,team_id);
    
    Team.save(function(error){
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
            response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Team created";//log message for client
            response.data.success = 1;//flag success
            response.data.team_id = team_id;
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement            
        }
    })
}

exports.create_team_callback = function(id,requestBody,callback){
    
    var team_id = id;
    
    var Team = toTeams(requestBody,team_id);
    
    Team.save(function(error){
        if(error){
            callback(false);           
        }else{
            callback(true)          
        }
    })
}

exports.fetch_compartment_team_id = function(startup_id,compartment,callback){
    Teams.findOne({$and: [{startup_id: startup_id},{compartment: compartment}]},function(error,data){
        if(error){
            callback(false)
        }else{
            if(data && Object.keys(data).length>0){
                callback(data.id)
            }else{
                callback(false);
            }
        }
    })
}



exports.delete_team = function(requestBody,response){
    var team_id = requestBody.team_id;
    
    Teams.remove({id: team_id},function(error){
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
            response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
            response.data.log = "Team Deleted";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement            
        }        
    })
}

exports.create_compartment_root_team = function(requestBody,response){
    
}

exports.fetch_team = function(requestBody,response){
    
    response.data = {};
    
    Teams.findOne({id: requestBody.team_id},function(error,data){
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
            if(data && Object.keys(data).length>0){
                
                var team_details = data;
                
                Members.fetch_team_members(requestBody.team_id,function(fetched){
                    if(!fetched){
                        response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "No Members found";//log message for client
                        response.data.success = 1;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                          
                    }else{
                        response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                        response.data.log = "Members fetched";//log message for client
                        response.data.team_info = team_details;
                        response.data.team_members = fetched;
                        response.data.success = 1;//flag success
                        response.end(JSON.stringify(response.data));//send response to client
                        return;//return statement                          
                    }
                })            
                
                
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Team not found";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }
        }
    })
}

function toTeams(data,team_id){
    return new Teams({
        id: team_id,
        project_id: data.project_id,
        parent_team: data.parent_team,
        team_name: data.team_name,
        created_at: Date.now(),
        startup_id: data.startup_id,
        compartment: data.compartment        
    });
}