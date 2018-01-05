var mongoose = require("mongoose"),
    shortid = require("shortid");

var skillsSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true},
    skill: {type: String, require: true, unique: true}
});

var Skills = mongoose.model('Skills',skillsSchema);

var toolsSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true},
    tool: {type: String, require: true, unique: true}
});

var Tools = mongoose.model('Tools',toolsSchema);

var exports = module.exports;

exports.skills = Skills;
exports.tools = Tools;

exports.create_skill = function(name,callback){
    Skills.findOne({skill: name},function(error,data){
        if(error){
            console.log(error)
            callback(false);
        }else{
            if(data && (Object.keys(data).length > 0)){
                callback(data.id)
            }else{
                
                var id = shortid.generate();
                
                var Skill = toSkill(id,name);
                
                Skill.save(function(error){
                    if(error){
                        callback(false);
                    }else{
                        callback(id);
                    }
                })
            }
        }
    });
}

exports.create_tool = function(name,callback){
    Tools.findOne({tool: name},function(error,data){
        if(error){
            console.log(error)
            callback(false);
        }else{
            if(data && (Object.keys(data).length > 0)){
                callback(data.id)
            }else{
                
                var id = shortid.generate();
                
                var Tool = toTool(id,name);
                
                Tool.save(function(error){
                    if(error){
                        callback(false);
                    }else{
                        callback(id);
                    }
                })
            }
        }
    });    
}

exports.check_similar_skills = function(name,response){
    Skills.find({skill: {$regex: '.*'+name+'.*'}},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal server error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));
            }else{
                console.log(error);
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                
            }             
        }else{
            if(data && Object.keys(data).length > 0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                       
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Matches";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));
            }
        }
    });
}

exports.check_similar_tools = function(name,response){
    Tools.find({tool: {$regex: '.*'+name+'.*'}},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal server error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));
            }else{
                console.log(error);
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                
            }             
        }else{
            if(data && Object.keys(data).length > 0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                       
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Matches";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));
            }
        }
    });    
}

function toSkill(id,skill){
    return new Skills({
        id: id,
        skill: skill
    })
}

function toTool(id,tool){
    return new Tools({
        id: id,
        tool: tool
    });
}