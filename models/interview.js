var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Log = require('./logs'),
    Vacancies = require('./vacancies');

var InterviewRoomSchema = new mongoose.Schema({
    id: {type: String},
    application_id: {type: String, require: true, unique: true},
    created_at: {type: Date, require: true}, 
    updated_at: {type: Date, 'default': Date.now},
    terminated_at: {type: Date},
    terminated: {type: Boolean, 'default': false},
    terminated_by: {type: String}
});

var InterviewRooms = mongoose.model('Interview_Rooms',InterviewRoomSchema);

var InterviewMessagesSchema = new mongoose.Schema({
    id: {type: String, require: true},
    interview_id: {type: String,require: true},
    user_id: {type: String,require: true},
    message: {type: String, require: true},
    files_attached: {type: Boolean},
    timestamp: {type: Date, 'default': Date.now}
});

var InterviewMessages = mongoose.model('Interview_Messages',InterviewMessagesSchema);

var InterviewFilesSchema = new mongoose.Schema({
    id: {type: String, 'default': shortid.generate},
    message_id: {type: String, require: true},
    file: {
        bucket: {type: String, require: true},
        object: {type: String, require: true}
    },
    timestamp: {type: Date, 'default': Date.now}
});

var InterviewFiles = mongoose.model('Interview_Files',InterviewFilesSchema);


var exports = module.exports;
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

//admin functionality

exports.admin_terminate_interview = function(requestBody,response){
    response.data = {};//set response data object
    InterviewRooms.findOne({id:requestBody.interview_id},function(error,data){
        if(error){//if error in finding interview
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Internal Server error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Database Error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                 
            }
        }else{
            if(data){//if application is found
                data.terminated_at = Date.now(); //set termination date
                data.terminated = true; //terminate shii
                data.terminated_buy = requestBody.user_email; //set terminator email
                
                data.save(function(error){//save changes
                    if(error){
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal Server error";//user log message
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//user log message
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                 
                        }                        
                    }else{
                        var message = requestBody.user_email+" terminated interview",
                            startup_id = requestBody.startup_id,
                            user_email = requestBody.user_email,
                            task_id= null,
                            project_id = null,
                            compartment = "HR",
                            private = true;
                                                    
                        
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(t){
                            response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Interview Terminated";//user log message
                            response.data.success = 1;//success flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                                 
                        })               
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Interview Not Found!";//user log message
                response.data.success = 0;//success flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                 
            }
        }
    })
}

exports.fetch_admin_interview = function(requestBody,response){
    response.data = {};
    
    //returns  interview messages, files & message sender details.
    
    var aggregate = [{
        $match: {interview_id: requestBody.interview_id}
    },{
        $lookup: { //fetch attached files
            from: "interview_files",
            foreignField: "message_id",
            localField: "id",
            as: "attached_files",
        }
    },{
        $lookup: {//fetch message sender
            from: "users",
            foreignField: "id",
            localField: "user_id",
            as: "user_data",
        }
    },{
        $project: {
            id: 1,
            interview_id: 1,
            user_id: 1,
            message: 1,
            timestamp: 1,
            files_attached: 1,
            attached_files: 1,
            user_data: {
                dp: 1,
                fullname: 1,
                email: 1
            }
        }
    }];
    
    
    InterviewMessages.aggregate(aggregate,function(error,data){ //fetch messages
        if(error){
            //log error
            console.log(error);
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Internal Server Error";//user log message
                response.data.success = 0;//success flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                  
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Database Error";//user log message
                response.data.success = 0;//success flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                   
            }
        }else{
            if(data && Object.keys(data).length!=0){
                response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Data Fetched";//user log message
                response.data.data = data;
                response.data.success = 1;//success flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                   
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "No Messages Yet!";//user log message
                response.data.success = 0;//success flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                   
            }
        }
    })
}

exports.admin_create_message = function(requestBody,response){
    
    response.data = {};
    
    //step 1, check if interview room exists
    InterviewRooms.findOne({$and: [{application_id: requestBody.application_id},{terminated: false}]},function(error,data){
        if(error){
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Internal Server error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Database Error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                 
            }            
        }else{
            if(data){
                //create message
                var interview_id = data.id;
                
                if(requestBody.files_attached){
                    var messsage_id = requestBody.message_id;//NOTE THIS LATER ON
                }else{
                    var message_id = shortid.generate();//generate new message id            
                }                
                
                var Message = toInterviewMessage(message_id,interview_id,requestBody);
                
                Message.save(function(error){
                    if(error){
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal Server error";//user log message
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//user log message
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                 
                        }             
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "File Added";//user log message
                        response.data.message_id = message_id;
                        response.data.success = 1;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;            
                    }                    
                });
            }else{
                //create a new interview room
                var interview_id = shortid.generate();
                
                var Room = toInterviewRoom(interview_id,requestBody);
                
                Room.save(function(error){
                    if(error){
                        if(response==null){//check for error 500
                            response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Internal Server error";//user log message
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                            response.data.log = "Database Error";//user log message
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;                 
                        }                        
                    }else{
                   
                        //create  message here
                        if(requestBody.files_attached){
                            var messsage_id = requestBody.message_id;//NOTE THIS LATER ON
                        }else{
                            var message_id = shortid.generate();//generate new message id            
                        }                

                        var Message = toInterviewMessage(message_id,interview_id,requestBody);

                        Message.save(function(error){
                            if(error){
                                if(response==null){//check for error 500
                                    response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Internal Server error";//user log message
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                
                                }else{
                                    response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Database Error";//user log message
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                 
                                }             
                            }else{
                                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                response.data.log = "Message Sent";//user log message
                                response.data.message_id = message_id;
                                response.data.success = 1;//failed flag
                                response.end(JSON.stringify(response.data));//send message to user
                                return;            
                            }                    
                        });                                                
                        
                    }
                });
            }
        }
    });
}


exports.admin_add_file = function(requestBody,response){
    
    response.data = {};
    
    if(requestBody.message_id!=null && requestBody.message_id!=undefined){
        var message_id = requestBody.message_id;
    }else{
        var message_id = shortid.generate();
    }
    
    var File = toInterviewFile(message_id,requestBody);
    
    File.save(function(error){
        if(error){
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Internal Server error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Database Error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                 
            }             
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
            response.data.log = "File Added";//user log message
            response.data.message_id = message_id;
            response.data.success = 1;//failed flag
            response.end(JSON.stringify(response.data));//send message to user
            return;            
        }
    })
}




//user functionality
exports.user_add_file = function(requestBody,response){
    response.data = {};
    
    
    Vacancies.validate_application_access(requestBody.application_id,requestBody.user_id,function(validated){ //validate user accesss
        if(validated){
            if(requestBody.message_id!=null && requestBody.message_id!=undefined){
                var message_id = requestBody.message_id;
            }else{
                var message_id = shortid.generate();
            }

            var File = toInterviewFile(message_id,requestBody);

            File.save(function(error){
                if(error){
                    if(response==null){//check for error 500
                        response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Internal Server error";//user log message
                        response.data.success = 0;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Database Error";//user log message
                        response.data.success = 0;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                 
                    }             
                }else{
                    response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                    response.data.log = "File Added";//user log message
                    response.data.message_id = message_id;
                    response.data.success = 1;//failed flag
                    response.end(JSON.stringify(response.data));//send message to user
                    return;            
                }
            });            
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
            response.data.log = "User Unauthorized!";//user log message
            response.data.success = 0;//failed flag
            response.end(JSON.stringify(response.data));//send message to user
            return;             
        }
    });
        
}


exports.fetch_user_interview = function(requestBody,response){
    response.data = {};
    
    
    Vacancies.validate_application_access(requestBody.application_id,requestBody.user_id,function(validated){ //validate user accesss
        if(validated){
            //returns  interview messages, files & message sender details.

            var aggregate = [{
                $match: {interview_id: requestBody.interview_id}
            },{
                $lookup: { //fetch attached files
                    from: "interview_files",
                    foreignField: "message_id",
                    localField: "id",
                    as: "attached_files",
                }
            },{
                $lookup: {//fetch message sender
                    from: "users",
                    foreignField: "id",
                    localField: "user_id",
                    as: "user_data",
                }
            },{
                $project: {
                    id: 1,
                    interview_id: 1,
                    user_id: 1,
                    message: 1,
                    timestamp: 1,
                    files_attached: 1,
                    attached_files: 1,
                    user_data: {
                        dp: 1,
                        fullname: 1,
                        email: 1
                    }
                }
            }];


            InterviewMessages.aggregate(aggregate,function(error,data){ //fetch messages
                if(error){
                    //log error
                    console.log(error);
                    if(response==null){//check for error 500
                        response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Internal Server Error";//user log message
                        response.data.success = 0;//success flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                  
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Database Error";//user log message
                        response.data.success = 0;//success flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                   
                    }
                }else{
                    if(data && Object.keys(data).length!=0){
                        response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Data Fetched";//user log message
                        response.data.data = data;
                        response.data.success = 1;//success flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                   
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "No Messages Sent Yet";//user log message
                        response.data.success = 0;//success flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                   
                    }
                }
            });            
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
            response.data.log = "User Unauthorized!";//user log message
            response.data.success = 0;//failed flag
            response.end(JSON.stringify(response.data));//send message to user
            return;             
        }
    })
   
}



exports.user_create_message = function(requestBody,response){
    
    response.data = {};
    
    //step 1, check if interview room exists
    InterviewRooms.findOne({$and: [{application_id: requestBody.application_id},{terminated: false}]},function(error,data){
        if(error){
            if(response==null){//check for error 500
                response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Internal Server error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Database Error";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                 
            }            
        }else{
            if(data && Object.keys(data).length>0){
                
                //check if user has authorization to post message
                Vacancies.validate_application_access(requestBody.application_id,requestBody.user_id,function(access){
                    if(access){
                        //create message
                        var interview_id = data.id;
                        
                        if(requestBody.files_attached){
                            var messsage_id = requestBody.message_id;//NOTE THIS LATER ON
                        }else{
                            var message_id = shortid.generate();//generate new message id            
                        }                

                        var Message = toInterviewMessage(message_id,interview_id,requestBody);

                        Message.save(function(error){
                            if(error){
                                if(response==null){//check for error 500
                                    response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Internal Server error";//user log message
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                
                                }else{
                                    response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Database Error";//user log message
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                 
                                }             
                            }else{
                                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                response.data.log = "Message Sent";//user log message
                                response.data.message_id = message_id;
                                response.data.success = 1;//failed flag
                                response.end(JSON.stringify(response.data));//send message to user
                                return;            
                            }                    
                        });
                        
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "User Unauthorized!";//user log message
                        response.data.success = 0;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                          
                    }
                });            
                        
            }else{            
                response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                response.data.log = "Interview Not Found";//user log message
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;                 
            }
        }
    })    
}



exports.user_terminate_interview = function(requestBody,response){
    response.data = {};//set response data object
    Vacancies.validate_application_access(requestBody.application_id,requestBody.user_id,function(validated){ //validate user accesss
        if(validated){    
            InterviewRooms.findOne({id:requestBody.interview_id},function(error,data){
                if(error){//if error in finding interview
                    if(response==null){//check for error 500
                        response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Internal Server error";//user log message
                        response.data.success = 0;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Database Error";//user log message
                        response.data.success = 0;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                 
                    }
                }else{
                    if(data){//if application is found
                        data.terminated_at = Date.now(); //set termination date
                        data.terminated = true; //terminate shii
                        data.terminated_buy = requestBody.user_email; //set terminator email

                        data.save(function(error){//save changes
                            if(error){
                                if(response==null){//check for error 500
                                    response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Internal Server error";//user log message
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                
                                }else{
                                    response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Database Error";//user log message
                                    response.data.success = 0;//failed flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                 
                                }                        
                            }else{
                                var message = requestBody.user_email+" terminated interview",
                                    startup_id = requestBody.startup_id,
                                    user_email = requestBody.user_email,
                                    task_id= null,
                                    project_id = null,
                                    compartment = "HR",
                                    private = true;


                                Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(t){
                                    response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
                                    response.data.log = "Interview Terminated";//user log message
                                    response.data.success = 1;//success flag
                                    response.end(JSON.stringify(response.data));//send message to user
                                    return;                                 
                                });               
                            }
                        })
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
                        response.data.log = "Interview Not Found!";//user log message
                        response.data.success = 0;//success flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;                 
                    }
                }
            });    
        }else{
            response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
            response.data.log = "User Unauthorized!";//user log message
            response.data.success = 0;//failed flag
            response.end(JSON.stringify(response.data));//send message to user
            return;             
        }
    });
}

function toInterviewRoom(id,data){
    return new InterviewRooms({
        id: id,
        application_id: data.application_id,
        created_at: Date.now()      
    });
}

function toInterviewMessage(id,interview_id,data){
    return new InterviewMessages({
        id: id,
        user_id: data.user_id,
        interview_id: interview_id,
        message: data.message,
        files_attached: data.files_attached
    });
}

function toInterviewFile(message_id,data){
    return new InterviewFiles({
        message_id: message_id,
        file: {
            bucket: data.bucket,
            object: data.object 
        }        
    });
}