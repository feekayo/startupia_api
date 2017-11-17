var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Sessions = require('./sessions'),
    Users = require('./users');

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var personnelSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_email: {type: String, require: true},
    startup_id: {type: String, require: true},
    signed_employment_contract: {
        bucket: String,
        object_key: String
    },
    verified: {type: Boolean, 'default': false},
    timestamp: {type: Date, 'default': Date.now}
});

var Personnel = mongoose.model('personnel',personnelSchema);

var personnelQueueSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true},
    user_email: {type: String, require: true},
    startup_id: {type: String, require: true},
    message: String,
    employment_contract: {
        bucket: String,
        object_key: String
    }
});

var PersonnelQueue = mongoose.model('personnel_queue',personnelQueueSchema);

var exports = module.exports;

exports.create_personnel = function(requestBody,response){
    
    response.data = {};//response array
    
    Personnel.findOne({$and: [{user_email: requestBody.user_email},{startup_id: requestBody.startup_id}]},function(requestBody,response){
       if(error){
           if(response==null){//check for 500 error
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;               
           }else{//check for database error
				response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Database Error!";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;               
           }
       }else{
            if(data){
                //report existence
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Staff record exists";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
            }else{
                PersonnelQueue.findOne({$and: [{user_email: requestBody.user_email},{startup_id: requestBody.startup_id}]},function(requestBody,response){//check personnel queue
                   if(error){
                       if(response==null){//check for 500 error
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal server error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                       }else{//check for database error
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error!";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                       }
                   }else{
                        if(data){
                            //report existence
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Staff Invite Record Exists!";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                            
                        }else{
                            //insert into database
                            var id = shortid.generate();
                            
                            var Invite = toPersonnelQueue(data,id);
                            
                            Invite.save(function(error){
                                if(error){
                                    if(response==null){
                                        response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                        response.data.log = "Internal server error";//send message to user
                                        response.data.success = 0;//failed flag
                                        response.end(JSON.stringify(response.data));//send message to user                                        
                                    }else{
                                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                        response.data.log = "Database Error!";//send message to user
                                        response.data.success = 0;//failed flag
                                        response.end(JSON.stringify(response.data));//send message to user                                        
                                    }
                                }else{

                                    var request = sendgrid.emptyRequest({
                                    method: 'POST',
                                    path: '/v3/mail/send',
                                    body: {
                                        personalizations: [
                                            {
                                            to: [{
                                               email: requestBody.email,
                                            },
                                            ],
                                                subject: 'Startupia Job Alert! Do not reply',
                                                  },
                                        ],
                                        from: {
                                            email: 'jobs@startupia.io',
                                        },
                                        content: [
                                            {
                                                type: 'text/html',
                                                value: "<h1>"+requestBody.startup_name+" Job Invite</h1><br/><h5>"+requestBody.message+"</h5><br/>Click here for more details <a href='https://startupia-frontend.herokuapp.com/startups/staff_invites/"+id+"'>DETAILS</a>"
                                                },
                                            ],
                                        },
                                    });
                                    //With callback
                                    sendgrid.API(request, function(error, qresponse) {
                                         if (error) {
                                            console.log(error);
                                            //send email here
                                            response.writeHead(200,{'Content-Type':'application/json'});//set response type
                                            response.data.log = "Trouble sending Invite Mail";//log response
                                            response.data.success = 1;
                                            response.end(JSON.stringify(response.data));
                                         }else{
                                            //send email here
                                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                            response.data.log = "Job Invite Sent";//log response
                                            response.data.success = 1;
                                            response.end(JSON.stringify(response.data));
                                        }
                                    });							

                                }
                            })
                        }
                   }
                });
            }
       }
    });
}

exports.fetch_personnel_invite = function(requestBody,response){
    
}

exports.save_personnel = function(requestBody,response){
    
}

exports.validate_personnel = function(requestBody,response){
    
}

exports.create_vacancy = function(requestBody,response){
    
}

function toPersonnel (data){
    return new Personnel({
        user_email: {type: String, require: true},
        startup_id: {type: String, require: true},
        signed_employment_contract: {
            bucket: String,
            object_key: String
        }      
    });
}
function toPersonnelQueue(data,id){
    return new PersonnelQueue({
        id: id,
        user_email: data.user_email,
        message: data.message,
        startup_id: data.startup_id,
        employment_contract: {
            bucket: data.bucket,
            object_key: data.object_key
        }        
    })
}