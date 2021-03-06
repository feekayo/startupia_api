var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Sessions = require('./sessions'),
    Users = require('./users'),
    Log = require('./logs');

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


var staffAssignmentsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    personnel_email: {type: String, require: true},
    department_code: {type: String, require: true}
});

var StaffAssignments = mongoose.model('staff_assignments',staffAssignmentsSchema)


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

exports.fetch_startup_personnel = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id:requestBody.startup_id},{verified: true}]}
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
            startup_id: 1,
            signed_employment_contract: {
                bucket: 1,
                object_key: 1
            },
            position_title: 1,
            non_compete: 1,
            verified: 1,
            timestamp:1,
            user_data: {
            	id: 1,
                fullname: 1,
                dp: 1,
                location: 1,
                bio: 1                
            }            
        }
        
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    }]
    
    Personnel.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.success = 1;
                response.data.data = data;
                response.end(JSON.stringify(response.data));                   
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Employees";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                      
            }
        }
    });
}

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
                Personnel.findOne({$and: [{personnel_email: requestBody.personnel_email},{startup_id: requestBody.startup_id}]},function(error,data){
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
                            PersonnelQueue.findOne({$and: [{personnel_email: requestBody.personnel_email},{startup_id: requestBody.startup_id}]},function(error,data){//check personnel queue
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

                                        var Invite = toPersonnelQueue(requestBody,id);

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
                                                
                                                var email = requestBody.personnel_email;
                                                
                                                var request = sendgrid.emptyRequest({
                                                  method: 'POST',
                                                  path: '/v3/mail/send',
                                                  body: {
                                                    personalizations: [
                                                      {
                                                        to: [
                                                          {
                                                            email: email,
                                                          },
                                                        ],
                                                        subject: 'Startupia Job Invites! Do not reply',
                                                      },
                                                    ],
                                                    from: {
                                                      email: 'jobs@startupia.io',
                                                    },
                                                    content: [
                                                      {
                                                        type: 'text/html',
                                                        value: "<h1>"+requestBody.startup_name+" Job Invite</h1><br/><h5>"+requestBody.message+"</h5><br/>Click here for more details <a href='https://startupia-frontend.herokuapp.com/startups/staff_invites/"+id+"'>DETAILS</a>",
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
                                                    response.data.log = "Invite Created, Trouble sending Invite Mail";//log response
                                                    response.data.success = 1;
                                                    response.end(JSON.stringify(response.data));
                                                  }else{
                                                    //send email here
                                                    response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                                    response.data.log = "Invite Sent";//log response
                                                    response.data.success = 1;
                                                    response.end(JSON.stringify(response.data));
                                                  }
                                                  console.log(qresponse.statusCode);
                                                  console.log(qresponse.body);
                                                  console.log(qresponse.headers);
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
        $match: {$and: [{startup_id: startup_id},{accepted: false},{rejected: false}]}
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


exports.fetch_startups_job_invites = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{accepted: false},{rejected: false}]}
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
            startup_id: 1,
            message: 1,
            employment_contract: {
                bucket: 1,
                object_key: 1
            },
            position_title: 1,
            non_compete: 1,
            accepted: 1,
            rejected: 1,
            timestamp: 1,
            user_data: {
               id: 1,
	           fullname: 1,
                dp: {
                    bucket: 1,
                    object_key: 1
                },
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
                response.data.log = "No Active Invites";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                   
            }
        }
    });     
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
                        var message = data.personnel_email+" rejected job invite",//log message
                            user_email = data.personnel_email, //user email
                            startup_id = data.startup_id,//no startup involved
                            task_id = null,//no task involved
                            project_id = null,//no project involved
                            compartment = "HR",
                            private = true;
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                            //send email here
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Offer Rescinded";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));  
                        });                          
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

exports.fetch_personnel_invite = function(requestBody,response){
    var id = requestBody.invite_id;
    
    response.data = {};
    
    PersonnelQueue.findOne({$and: [{id: id},{accepted: false},{rejected: false}]},function(error,data){
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
                response.data.log = "Invite fetched";//log response
                response.data.success = 1;
                response.data.data = data;
                response.end(JSON.stringify(response.data));                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Offer Non-Existent";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                  
            }
        }
    });    
}

exports.update_invite = function(requestBody,response){
    var id = requestBody.invite_id;
    
    response.data = {};
    
    PersonnelQueue.findOne({$and: [{id: id},{accepted: false},{rejected: false}]},function(error,data){
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
                
                data.message = requestBody.message;
                data.employment_contract.bucket = requestBody.bucket;
                data.employment_contract.object_key = requestBody.object_key;
                data.position_title = requestBody.position_title;
                data.non_compete = requestBody.non_compete;            
                
                
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
                        var message = requestBody.user_email+" updated a job offer to "+data.personnel_email,//log message
                            user_email = requestBody.user_email, //user email
                            startup_id = data.startup_id,//no startup involved
                            task_id = null,//no task involved
                            project_id = null,//no project involved
                            compartment = "HR",
                            private = true;
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                            //send email here
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Offer Updated";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));  
                        });                          
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Offer can no longer be updated";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                  
            }
        }
    });
}

exports.delete_invite = function(requestBody,response){
    var id = requestBody.invite_id;
    
    response.data = {};
    
    PersonnelQueue.findOne({$and: [{id: id},{accepted: false},{rejected: false}]},function(error,data){
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
                
                data.remove(function(error){
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
                        var message = requestBody.user_email+" deleted a job offer to "+data.personnel_email,//log message
                            user_email = requestBody.user_email, //user email
                            startup_id = data.startup_id,//no startup involved
                            task_id = null,//no task involved
                            project_id = null,//no project involved
                            compartment = "HR",
                            private = true;
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                            //send email here
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Offer Updated";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));  
                        });                         
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Offer can no longer be updated";//log response
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
    
    PersonnelQueue.findOne({$and: [{personnel_email: personnel_email}, {id: id},{accepted: false},{rejected: false}]},function(error,data){
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
                                            var message = requestBody.personnel_email+" accepted job invite",//log message
                                                user_email = requestBody.user_email, //user email
                                                startup_id = data.startup_id,//no startup involved
                                                task_id = null,//no task involved
                                                project_id = null,//no project involved
                                                compartment = "HR",
                                                private = true;

                                                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      

                                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                            response.data.log = "Invite accepted, pending verification!";//log response
                                            response.data.success = 1;
                                            response.end(JSON.stringify(response.data));                                 
                                                        });
                                            
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

exports.fetch_unvalidated_staff = function(requestBody,response){
    
    response.data = {};
    
    var startup_id = requestBody.startup_id;
    var aggregate = [{
            $match: {$and: [{startup_id: startup_id},{verified: false}]}
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
        }];
    
    Personnel.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Unverified Staff";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                
            }
        }
    })
}

exports.fetch_validated_staff = function(requestBody,response){
    
    response.data = {};
    
    var startup_id = requestBody.startup_id;
    var aggregate = [{
            $match: {$and: [{startup_id: startup_id},{verified: true}]}
        },{
            $lookup: {
                from: "users",
                foreignField: "email",
                localField: "personnel_email",
                as: "user_data"
            }   
        },{
            $lookup: {
                from: "staff_assignments",
                foreignField: "personnel_email",
                localField: "personnel_email",
                as: "current_departments"
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
                },
                current_departments: {
                    department_code: 1
                }
            }
        }];
    
    Personnel.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Staff";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));                
            }
        }
    })
}

exports.retract_validation = function(requestBody,response){
    response.data = {};
    
    Personnel.findOne({$and: [{id: requestBody.personnel_id},{verified: false}]},function(error,data){ //find personnel file
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
            if(data){
                PersonnelQueue.findOne({$and: [{personnel_email: data.personnel_email},{startup_id: data.startup_id}]},function(error,edata){//find job invite
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
                        if(edata){
                            //update invite data & reactivate it
                            edata.rejected = false;
                            edata.accepted = false;
                            edata.message = requestBody.message;
                            
                            edata.save(function(error){
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
                                    data.remove(function(error){ //delete employee file
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
                                           var message = requestBody.user_email+" redacted "+data.personnel_email+"'s employment",//log message
                                               user_email = requestBody.user_email, //user email
                                               startup_id = requestBody.startup_id,//no startup involved
                                               task_id = null,//no task involved
                                               project_id = null,//no project involved
                                               compartment = "HR",
                                               private = true;

                                           Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                                                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                                response.data.log = "Successful Retraction";//log response
                                                response.data.success = 1;
                                                response.end(JSON.stringify(response.data)) 
                                           });                                            
;                                               
                                        }
                                    })
                                }
                            })
                            
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Invite reactivation failed";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));                             
                        }
                    }
                })
                
                
                var Personnel = toPersonnel(data, bucket, object_key);
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Data";//log response
                response.data.success = 1;
                response.end(JSON.stringify(response.data));                 
            }
        }
    })    
}

exports.validate_personnel = function(requestBody,response){
    var email = requestBody.personnel_email;
    var startup_id = requestBody.startup_id;
    
    response.data = {};
    
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
                       var message = requestBody.user_email+" validated "+requestBody.personnel_email+"'s employment",//log message
                           user_email = requestBody.user_email, //user email
                           startup_id = requestBody.startup_id,//no startup involved
                           task_id = null,//no task involved
                           project_id = null,//no project involved
                           compartment = "HR",
                           private = true;

                       Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Employment Validated!";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));  
                       }); 
                       
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

exports.create_staff_assignment = function(startup_id,personnel_email,department_code,callback){

    StaffAssignments.findOne({$and: [{startup_id: startup_id},{personnel_email:personnel_email},{department_code: department_code}]},function(error,data){        
        if(data && Object.keys(data)>0){
            callback(0);
        }else{  
            var StaffAssignment = toStaffAssignment(startup_id,personnel_email,department_code);

            StaffAssignment.save(function(error){
                if(error){
                    //log error
                    callback(1);
                }else{
                    callback(2);
                }
            });
        }
    });

}

exports.delete_staff_assignment = function(startup_id,personnel_email,department_code,callback){

    StaffAssignments.remove({$and: [{startup_id: startup_id},{personnel_email:personnel_email},{department_code: department_code}]},function(error){
        if(error){
            //log error
            callback(false);
        }else{
            callback(true);
        }
    })

}

function toPersonnel (data,bucket,object_key){
    return new Personnel({
        personnel_email: data.personnel_email,
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

function toStaffAssignment(startup_id,personnel_email,department_code){
    return new StaffAssignments({
        startup_id: startup_id,
        personnel_email: personnel_email,
        department_code: department_code       
    })
}