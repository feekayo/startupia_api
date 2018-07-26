/**
    team messages
    
    id
    team_id
    message
    file_attached
    timestamp
**/

/**
    attached_file messages
    message_id
    file
    timestamp
**/

var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Sessions = require('../sessions'),
    Log = require('../logs');
    
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var messagesSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true},
    team_id: {type: String, require: true},
    user_id: {type: String, require: true},
    topic: {type: String, require: true},
    private: {type: Boolean, require: true},
    message: {type: String, require: true},
    timestamp: {type: Date, 'default': Date.now},
});

var Messages = mongoose.model('team_messages',messagesSchema);

var topicsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    message_id: {type: String, require: true},
    team_id: {type: String, require: true},
    topic: {type: String, require: true}
});

var Topics = mongoose.model('team_topics',topicsSchema);

var mentionsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    message_id: {type: String, require: true},
    team_id: {type: String, require: true},
    user_id: {type: String, require: true}
});

var Mentions = mongoose.model('team_mentions',mentionsSchema);

var filesSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    team_id: {type: String, require: true},
    file: {
        bucket: {type: String, require: true},
        object: {type: String, require: true}
    },
    timestamp: {type: Date, 'default': Date.now},
});

var Files = mongoose.model('team_files',filesSchema);

var exports = module.exports;

exports.create_message = function(requestBody,response){
       
        var message_id = shortid.generate();

        var Message = toMessage(requestBody,topic_id,message_id);

        Message.save(function(error){
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
                if(requestBody.files_attached!=true){
                    response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                    response.data.log = "Message Sent!";//log message for client
                    response.data.success = 1;//flag success
                    response.end(JSON.stringify(response.data));//send response to client
                    return;//return statement            
                }else{
                    create_file(requestBody,message_id,function(created){
                       if(created){
                           response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                           response.data.log = "Message Sent!";//log message for client
                           response.data.success = 1;//flag success
                           response.end(JSON.stringify(response.data));//send response to client
                           return;//return statement                            
                       }else{
                           response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                           response.data.log = "Message Sent, Error Attaching File!";//log message for client
                           response.data.success = 1;//flag success
                           response.end(JSON.stringify(response.data));//send response to client
                           return;//return statement                             
                       } 
                    });
                }
            }
        })
}

exports.fetch_topics = function(requestBody,response){
    
}

exports.delete_message = function(requestBody,response){
    
}

exports.fetch_messages = function(requestBody,response){
    
}

exports.fetch_files = function(requestBody,response){
    
}


function create_mention(){
    
}

function create_topic(){
    
}

function create_file(data,message_id,callback){
    var File = toFile(data,message_id);
    
    File.save(function(error){
        if(error){
            callback(false);
        }else{
            callback(true);
        }
    })
}




function toMessage(data,topic_id,message_id){
    return new Messages ({
        id: message_id,
        team_id: data.team_id,
        user_id: data.user_id,
        topic_id: topic_id,
        private: data.private,
        message: data.message        
    });
}

function toMention(data){
    return new Mentions({
        message_id: data.message_id,
        team_id: data.team_id,
        user_id: data.user_id        
    });
}

function toTopic(data){
    return new Topics({
        message_id: data.message_id,
        team_id: data.team_id,
        topic: topic       
    });
}

function toFile(data,message_id){
    return new Files({
        team_id: data.team_id,
        message_id: message_id, 
        file: {
            bucket: data.bucket,
            object: data.object
        }
    });
}