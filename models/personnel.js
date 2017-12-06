var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Sessions = require('./sessions'),
    Users = require('./users');

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var personnelSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    personnel_email: {type: String, require: true},
    startup_id: {type: String, require: true},
    signed_employment_contract: {
        bucket: String,
        object_key: String
    },
    position_title: {type: String},
    non_compete: {type: Boolean},
    verified: {type: Boolean, 'default': false},
    timestamp: {type: Date, 'default': Date.now}
});

var Personnel = mongoose.model('personnel',personnelSchema);

var personnelQueueSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true},
    personnel_email: {type: String, require: true},
    startup_id: {type: String, require: true},
    message: String,
    employment_contract: {
        bucket: String,
        object_key: String
    },
    position_title: {type: String},
    non_compete: {type: Boolean},
    accepted: {type: Boolean, 'default': false},
    rejected: {type: Boolean, 'default': false},
    timestamp: {type:Date, 'default': Date.now }
});

var PersonnelQueue = mongoose.model('personnel_queue',personnelQueueSchema);

var exports = module.exports;

exports.personnel_model = Personnel;

exports.create_personnel = function(requestBody,response){
    
    response.data = {};//response array
    Personnel.findOne({$and: [{personnel_email:requestBody.personnel_email},{non_compete:true}]},function(error,data){
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
           if(data && Object.keys(data).length!=0){
               response.writeHead(200,{'Content-Type':'application/json'});//set response type
               response.data.log = "User covered by Non-Compete!";//log response
               response.data.success = 0;
               response.end(JSON.stringify(response.data));   
           }else{
                Personnel.findOne({$and: [{personnel_email: requestBody.personnel_email},{startup_id: requestBody.startup_id}]},function(requestBody,response){
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
                        if(data && Object.keys(data).length!=0){
                            //report existence
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Staff record exists";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                        }else{
                            PersonnelQueue.findOne({$and: [{personnel_email: requestBody.personnel_email},{startup_id: requestBody.startup_id}]},function(requestBody,response){//check personnel queue
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
                                    if(data && Object.keys(data).length!=0){
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
       }
    });
}

exports.fetch_company_invites = function(requestBody,response){
    var startup_id = requestBody.startup_id;
    
    var aggregate = [{
        $match: [{$and: [{startup_id: startup_id},{accepted: false},{rejected: false}]}]
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "personnel_email",
            as: "user_data"
        }   
    },{
        $project: {
            id: 1,
            personnel_email: 1,
            message: 1,
            startup_id: 1,
            employment_contract: {
                bucket: 1,
                object_key: 1
            },        
            non_compete: 1,
            user_data: {
            	id: 1,
                fullname: 1,
                dp: 1,
                phone: 1,
                bio: 1
            }
        }
    }]
    
    PersonnelQueue.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length!=0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                  
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Active Personnel Invites";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                   
            }
        }
    })
}

exports.fetch_user_invites = function(user_email,response){
    
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{personnel_email: user_email},{accepted: false},{rejected: false}]}
    },{
        $lookup: {
            from: "startups",
            foreignField: "id",
            localField: "startup_id",
            as: "startup_data"
        }   
    },{
        $lookup: {
            from: "startupsqueue",
            foreignField: "id",
            localField: "startup_id",
            as: "temp_startup_data"
        }
    }]
    
    PersonnelQueue.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length!=0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                  
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Active Invites";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                   
            }
        }
    })    
}

exports.reject_personnel_invite = function(requestBody,response){
    var id = requestBody.invite_id;
    
    response.data = {};
    
    Personnel.findOne({$and: [{id: id},{accepted: false},{rejected: false}]},function(error,data){
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
            if(data && Object.keys(data).length!=0){
                
                data.remove(function(error){//remove data
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
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Offer Rescinded";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));                         
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Offer Non-Existent";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                  
            }
        }
    });    
}

exports.reject_invites = function(requestBody,response){
    var id = requestBody.invite_id;
    var personnel_email = requestBody.personal_email;
    
    response.data = {};
    
    Personnel.findOne({$and: [{personnel_email: personnel_email}, {id: id},{accepted: false},{rejected: false}]},function(error,data){
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
            if(data && Object.keys(data).length!=0){
                data.rejected = true;
                
                data.save(function(error){
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
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Offer Rejected";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));                         
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Offer Non-Existent";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                  
            }
        }
    });
}

exports.save_personnel = function(requestBody,response){
    var id = requestBody.invite_id;
    var personnel_email = requestBody.personnel_email;
    
    var object_key = requestBody.object_key;
    var bucket = requestBody.bucket;
    
    response.data = {};
    Personnel.findOne({$and: [{personnel_email: personnel_email},{non_compete:true}]},function(error,data){
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
            if(data && Object.keys(data)>0){
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "You're already covered by non-compete clause";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                 
            }else{
                PersonnelQueue.findOne({$and: [{personnel_email: personnel_email}, {id: id},{accepted: false},{rejected: false}]}, function(error,data){

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
                        if(data && Object.keys(data).length!=0){

                            data.accepted = true;//update acceptance boolean

                            data.save(function(error){
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

                                    var Personnel = toPersonnel(data, bucket, object_key);

                                    Personnel.save(function(error){
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
                                            console.log(error);
                                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                            response.data.log = "Invite accepted, pending verification!";//log response
                                            response.data.success = 1;
                                            response.end(JSON.stringify(response.data));                                 
                                        }
                                    });
                                }
                            });

                        }else{
                            //send email here
                            response.writeHead(200,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Invite Non-Existent";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));                
                        }
                    }
                });
            }
        }
    });                

}

exports.validate_personnel = function(requestBody,response){
    var email = requestBody.personnel_email;
    var startup_id = requestBody.startup_id;
    
    Personnel.findOne({$and: [{personnel_email: email},{startup_id: startup_id}]},function(error,data){
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
            if(data && Object.keys(data).length!=0){
                data.verified = true;
                
                data.save(function(error){
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
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Employment Validated!";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));                        
                   }
                });
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Record Not Found!";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                 
            }
        }
    })
}

exports.create_vacancy = function(requestBody,response){
    
}

exports.save_vacancy_skills = function(requestBody,response){
    
}

exports.fetch_vacancy_applicants = function(requestBody,response){
    
}


function toPersonnel (data,bucket,object_key){
    return new Personnel({
        personnel_email: {type: String, require: true},
        startup_id: data.startup_id,
        signed_employment_contract: {
            bucket: bucket,
            object_key: object_key
        },
        position_title: data.position_title,
        non_compete: data.non_compete
    });
}
function toPersonnelQueue(data,id){
    return new PersonnelQueue({
        id: id,
        personnel_email: data.personnel_email,
        message: data.message,
        startup_id: data.startup_id,
        employment_contract: {
            bucket: data.bucket,
            object_key: data.object_key
        },        
        position_title: data.position_title,
        non_compete: data.non_compete
    })
}