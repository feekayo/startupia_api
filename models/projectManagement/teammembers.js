var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Sessions = require('../sessions'),
    Log = require('../logs'),
    Privileges = require('../privileges'),
    Teams = require('./teams');
    
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var teammembersSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id: {type: String, require: 'true'},
    created_at: {type: Date, require: 'true', 'default': Date.now},
    team_id: {type: String, require: 'true'},
    admin: {type: Boolean, require: 'true'}    
});

var Team_Members = mongoose.model('team_members',teammembersSchema);

var onlineStatus = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id: {type: String, require: 'true'},
    member_id: {type: String, require: 'true'},
    status: {type: Boolean, require: 'true'}
});

var exports = module.exports;

exports.validate_department_access = function(requestBody,callback){

    Teams.fetch_compartment_team_id(requestBody.startup_id,requestBody.department_code,function(team_id){
        
        if(team_id){
            Team_Members.findOne({$and: [{user_id: requestBody.user_id},{team_id: team_id}]},function(error,data){
                if(error){
                    callback(false);
                }else{
                    if(data && Object.keys(data).length>0){
                        callback(true);
                    }else{
                        Privileges.validate_root_access(requestBody.department_code,requestBody.user_email,requestBody.startup_id,function(access){
                            if(access){
                                var TeamMember = toMember2(requestBody.user_id,team_id,true);
                                
                                TeamMember.save(function(error){
                                    if(error){
                                        callback(false);
                                    }else{
                                        callback(true);
                                    }
                                })
                            }else{
                                callback(false);
                            }
                        });
                    }
                }
            });            
        }else{
            callback(false);    
        }
    })

} 

exports.validate_membership = function(team_id,user_id,callback){
    Team_Members.findOne({$and: [{team_id: team_id},{user_id: user_id}]},function(error,data){
        if(error){
            console.log(error);
            callback(false);
        }else{
            if(data && Object.keys(data).length>0){
                callback(true);
            }else{
                callback(false);
            }
        }
    });
}

exports.validate_admin = function(team_id,user_id,callback){
    Team_Members.findOne({$and: [{team_id: team_id},{user_id: user_id},{admin: true}]},function(error,data){
        if(error){
            console.log(error);
            callback(false);
        }else{
            if(data && Object.keys(data).length>0){
                callback(true);
            }else{
                callback(false);
            }
        }
    })    
}

exports.add_member = function(requestBody,response){
 
    response.data = {};
    
    var Member = toMember(requestBody);
    
    Member.save(function(error){
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
            response.data.log = "Member Added";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })
}

exports.add_admin = function(requestBody,response){
    
    response.data = {};
    
    Team_Members.update({user_id: requestBody.admin_user_id},{$set: {admin: true}},function(error){
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
            response.data.log = "Admin Added";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })
}

/**

exports.add_admin = function(requestBody,response){
    
    response.data = {};
    
    Team_Members.update({id: requestBody.member_id},{$set: {admin: true}},function(error){
        if(error){
			if(response==null){//check for error 500
				callback(false);
			}else{
                callback(false);              
            }                          
        }else{
            callback(true);            
        }
    })
}

**/

exports.remove_member = function(requestBody,response){
    response.data = {};
    
    Team_Members.remove({$and: [{id: requestBody.member_id},{team_id: requestBody.team_id}]},function(error){
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
            response.data.log = "Member Removed";//log message for client
            response.data.success = 1;//flag success
            response.end(JSON.stringify(response.data));//send response to client
            return;//return statement             
        }
    })
}

exports.add_member_departments = function(user_id,team_id,admin,callback){

    Team_Members.findOne({$and: [{user_id: user_id},{team_id: team_id}]},function(error,data){
        if(error){
            callback(false);
        }else{
            if(data){
                callback(false);
            }else{
                var Member = toMember2(user_id,team_id,admin);

                Member.save(function(error){
                    if(error){
                        callback(false)
                    }else{
                        callback(true);
                    }
                });                
            }
        }
    });
}

exports.fetch_team_members = function(team_id,callback){
    
    var aggregate = [{
        $match: {team_id: team_id}
    },{
        $lookup: {
            from: "users",
            foreignField: "id",
            localField: "user_id",
            as: "user_data"            
        }
    },{
        $project: {
            id: 1,
            user_id: 1,
            team_id: 1,
            created_at: 1,
            admin: 1,
            user_data: {
            	id: 1,
                fullname: 1,
                dp: 1,
                location: 1,
                bio: 1                   
            }
        }
    }]
    
    Team_Members.aggregate(aggregate,function(error,data){
        if(error){
            console.log(error);
            callback(false);
        }else{
            if(data && Object.keys(data).length>0){
                callback(data);
            }else{
                callback(false);
            }
        }
    })
}

function toMember2(user_id,team_id,admin){
    return new Team_Members({
        user_id: user_id,
        team_id: team_id,
        admin: admin       
    })
}

function toMember(data){
    return new Team_Members({
        user_id: data.user_id,
        team_id: data.team_id,
        admin: data.admin       
    })
}