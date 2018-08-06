var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Sessions = require('./sessions'),
    Users = require('./users'),
    Logs = require('./logs'),
    SkillsnTools = require('./skillsntools');

/*
about me 500 word essay
introduction youtube video
educational background (certifications & degrees)
personal projects
skills wif auto complete
tools wif auto complete
social media
*/

var userCVSchema = new mongoose.Schema({
    id:  {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id:  {type: String, unique: true, require: true},
    max_education: {type: String},
    introduction_video_url: {type: String},
    cover_letter: {type: String},
    date_of_birth: {type: Date}
});

var UserCVs = mongoose.model('user_cvs',userCVSchema);

var usersSocialSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id: {type: String, require: true},
    platform: {type: String, require: true},
    url: {type: String, require: true}
});

var UserSocial = mongoose.model('user_social',usersSocialSchema);

var usersSkillsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default':shortid.generate},
    user_id: {type: String, require: true},
    skill_id: {type: String, require: true},
    proof_url: {type: String, require: true}
});

var UserSkills = mongoose.model('user_skills',usersSkillsSchema);

var usersToolsSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id: {type: String, require: true},
    tool_id: {type: String, require: true},
    proof_url: {type: String, require: true}
});

var UserTools = mongoose.model('user_tools',usersToolsSchema);

var userCertificatesSchema = new mongoose.Schema({
    id: {type: String, unique: true, require: true, 'default': shortid.generate},
    user_id: {type: String, require: true},
    type: {type: String, require: true},
    name: {type: String, require: true},
    specialization: {type: String, require: true},
    year: {type: String, require: true},
    proof: {
        bucket: {type: String, require: true},
        object: {type: String, require: true},
    }
});

var UserCertificates = mongoose.model('user_certificates',userCertificatesSchema)

var exports = module.exports;

exports.fetch_user_cv = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {user_id: requestBody.user_id}
    },{
        $lookup: {
            from: "users",
            foreignField: "id",
            localField: "user_id",
            as: "user_data"
        }
    },{
        $project: {
            user_id:  1,
            max_education: 1,
            introduction_video_url: 1,
            cover_letter: 1,
            date_of_birth: 1, 
            user_data: {
                fullname: 1,
                email: 1,
                dp: {
                    bucket:1,
                    object_key: 1
                },
                phone: 1,
                bio: 1,
                address: 1,
                zip_code: 1,
                town: 1,
                updated_at: 1,
                created_at: 1              
            }
        }
    }];
    
    UserCVs.aggregate(aggregate,function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                console.log(error);
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "CV not found";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }
    });
}

exports.fetch_user_certificates = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {user_id: requestBody.user_id}
    }];
    
    UserCertificates.aggregate(aggregate,function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Certificates not found";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }
    });
}

exports.fetch_user_skills = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {user_id: requestBody.user_id}
    },{
        $lookup: {
            from: "skills",
            foreignField: "id",
            localField: "skill_id",
            as: "skill_data"
        }
    }];
    
    UserSkills.aggregate(aggregate,function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Skills not found";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }
    });
}

exports.fetch_user_tools = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {user_id: requestBody.user_id}
    },{
        $lookup: {
            from: "tools",
            foreignField: "id",
            localField: "tool_id",
            as: "tools_data"
        }
    }];
    
    UserTools.aggregate(aggregate,function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "tools not found";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }
    });
},

exports.fetch_user_socials = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {user_id: requestBody.user_id}
    }];
    
    UserSocial.aggregate(aggregate,function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Profiles not found";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }
    });
}    


exports.addCV = function(requestBody,response){
    response.data = {};   
    UserCVs.findOne({user_id: requestBody.user_id},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "CV Exists";
                response.data.success = 0;
                response.end(JSON.stringify(response.data));
            }else{
                var CV = toCV(requestBody);
                
                CV.save(function(error){
                   if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                       
                   }else{
                        var message = requestBody.user_email+" created a CV",
                             user_email = requestBody.user_email,
                             startup_id = null,
                             task_id = null,
                             project_id = null,
                             compartment = null,
                             private = true;

                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "CV Created";
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));      
                        });                       
                                               
                   }
                });
            }
        }
    })
}

exports.addCertificate = function(requestBody,response){
    response.data = {};
    
    var Certificate = toCertificates(requestBody);
    
    Certificate.save(function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            var message = requestBody.user_email+" added certificate",
                 user_email = requestBody.user_email,
                 startup_id = null,
                 task_id = null,
                 project_id = null,
                 compartment = null,
                 private = true;
                                                       
            Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Certificate Added";//log response
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;      
            });                
              
        }
    });
}

exports.deleteCertificate = function(requestBody,response){
    var certificate_id = requestBody.certificate_id,
        user_id = requestBody.user_id;
    
    
    response.data = {};
    
    UserCertificates.remove({$and: [{id: certificate_id},{user_id: user_id}]},function(error){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            var message = requestBody.user_email+" removed certificate",
                 user_email = requestBody.user_email,
                 startup_id = null,
                 task_id = null,
                 project_id = null,
                 compartment = null,
                 private = true;
                                                       
            Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Certificate Removed";//log response
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;      
            });            
        }
    })
}
                            
exports.deleteSkill = function(requestBody,response){
    var skill_id = requestBody.skill_id,
        user_id = requestBody.user_id;
    
    
    response.data = {};
    
    UserSkills.remove({$and: [{id: skill_id},{user_id: user_id}]},function(error){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            var message = requestBody.user_email+" removed skill",
                 user_email = requestBody.user_email,
                 startup_id = null,
                 task_id = null,
                 project_id = null,
                 compartment = null,
                 private = true;
                                                       
            Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Skill Removed";//log response
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;      
            });            
        }
    })
}

                      
exports.deleteTool = function(requestBody,response){
    var tool_id = requestBody.tool_id,
        user_id = requestBody.user_id;
    
    
    response.data = {};
    
    UserTools.remove({$and: [{id: tool_id},{user_id: user_id}]},function(error){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }            
        }else{
            var message = requestBody.user_email+" removed tool",
                 user_email = requestBody.user_email,
                 startup_id = null,
                 task_id = null,
                 project_id = null,
                 compartment = null,
                 private = true;
                                                       
            Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Tool Removed";//log response
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;      
            });            
        }
    })
}                      
                      
exports.fetch_user_certificates = function(requestBody,response){
    response.data = {};
    
    UserCertificates.find({user_id: requestBody.user_id},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }             
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Certificates Fetched";//log response
                response.data.data = data;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return;  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "No Data";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }
        }
    })
}

exports.updateCV = function(requestBody,response){

    response.data = {};
    
    UserCVs.findOne({user_id: requestBody.user_id},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }
        }else{
            if(data && Object.keys(data).length>0){
                
                data.user_id = requestBody.user_id,
                data.max_education = requestBody.max_education,
                data.introduction_video_url = requestBody.introduction_video_url,
                data.cover_letter = requestBody.cover_letter,
                data.date_of_birth = requestBody.date_of_birth;
                
                data.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                        
                    }else{
                        var message = requestBody.user_email+" updated CV",
                            user_email = requestBody.user_email,
                            startup_id = null,
                            task_id = null,
                            project_id = null,
                            compartment = null,
                            private = true;
                                                       
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "CV Updated";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));   
                            return;     
                        });                        
                                                
                    }
                })
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "CV Not Found";
                response.data.success = 0;
                response.end(JSON.stringify(response.data));
                return;
            }
        }
    })    
}

exports.addSocial = function(requestBody,response){
    response.data = {};
    
    UserSocial.findOne({$and: [{user_id:requestBody.user_id},{platform:requestBody.platform}]},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }                                    
        }else{
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = requestBody.platform+" profile exists";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                var Social = toSocial(requestBody);
                
                Social.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                        
                    }else{
                        
                        var message = requestBody.user_email+" added "+requestBody.platform+" profile",
                            user_email = requestBody.user_email,
                            startup_id = null,
                            task_id = null,
                            project_id = null,
                            compartment = null,
                            private = true;
                                
                                
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = requestBody.platform+" profile saved";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));   
                            return;     
                        });                                                  
                    }
                });
            }
        }
    });
}

exports.updateSocial = function(requestBody,response){
    
    response.data = {};
    
    UserSocial.findOne({$and: [{user_id:requestBody.user_id},{platform:requestBody.platform}]},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }                                    
        }else{
            if(data && Object.keys(data).length>0){
                
                data.user_id = requestBody.user_id,
                data.platform = requestBody.platform,
                data.url = requestBody.url;               
                
                data.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                         
                    }else{
                        var message = requestBody.user_email+" updated "+requestBody.platform+" profile",
                            user_email = requestBody.user_email,
                            startup_id = null,
                            task_id = null,
                            project_id = null,
                            compartment = null,
                            private = true;
                                                       
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = requestBody.platform+" profile removed";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));   
                            return;     
                        });                               
                    }
                })               
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Data Not Found";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                   
            }
        }
    });    
}

exports.addTool = function(requestBody,response){
    
    response.data = {};
    
    SkillsnTools.tools.findOne({tool: requestBody.name},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }              
        }else{
            if(data && Object.keys(data).length>0){
                var tool_id = data.id;
                
                var Tool = toTool(tool_id,requestBody);
                
                Tool.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                         
                    }else{
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Tool Added!";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));   
                        return;                         
                    }
                });
            }else{
                SkillsnTools.create_tool(requestBody.name,function(tool_id){
                    if(tool_id){
                        var Tool = toTool(tool_id,requestBody);

                        Tool.save(function(error){
                            if(error){
                                if(response==null){
                                    response.writeHead(500,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Internal Server Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;                  
                                }else{
                                    response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Database Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;                
                                }                         
                            }else{
                                var message = requestBody.user_email+" added "+requestBody.name+" to tool set",
                                    user_email = requestBody.user_email,
                                    startup_id = null,
                                    task_id = null,
                                    project_id = null,
                                    compartment = null,
                                    private = true;
                                
                                
                                Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                                    response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Tool Added!";//log response
                                    response.data.success = 1;
                                    response.end(JSON.stringify(response.data));   
                                    return;    
                                });                            
                            }
                        });                        
                    }else{
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Error Adding New Tool";//log response
                        response.data.success = 0;
                        response.end(JSON.stringify(response.data));   
                        return;                        
                    }
                });                
            }
        }
    });
}

exports.removeTool = function(requestBody,response){
    
    response.data = {};
    
    UserTools.findOne({id: requestBody.tool_id},function(error,data){
        if(error){
          if(response==null){
            response.writeHead(500,{'Content-Type':'application/json'});//set response type
            response.data.log = "Internal Server Error";//log response
            response.data.success = 0;
            response.end(JSON.stringify(response.data));   
            return;                  
          }else{
            response.writeHead(201,{'Content-Type':'application/json'});//set response type
            response.data.log = "Database Error";//log response
            response.data.success = 0;
            response.end(JSON.stringify(response.data));   
            return;                
          }             
        }else{
            if(data && Object.keys(data).length>0){
                data.remove(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                         
                    }else{
                        var message = requestBody.user_email+" removed tool from tool set",
                            user_email = requestBody.user_email,
                            startup_id = null,
                            task_id = null,
                            project_id = null,
                            compartment = null,
                            private = true;
                                
                                
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Tool Removed";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));   
                            return;    
                        });                                
                    }
                });
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Record Doesn't Exist";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                      
            }
        }
    })
}

exports.addSkill = function(requestBody,response){
    
    response.data = {};
    
    console.log("requestBody");
    
    SkillsnTools.skills.findOne({skill: requestBody.name},function(error,data){
        if(error){
            if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
            }              
        }else{
            if(data && Object.keys(data).length>0){
                var skill_id = data.id;
                
                var Skill = toSkill(skill_id,requestBody);
                
                Skill.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                         
                    }else{
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Skill Added!";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));   
                        return;                         
                    }
                });
            }else{
                SkillsnTools.create_skill(requestBody.name,function(skill_id){
                    if(skill_id){
                        var Skill = toSkill(skill_id,requestBody);

                        Skill.save(function(error){
                            if(error){
                                if(response==null){
                                    response.writeHead(500,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Internal Server Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;                  
                                }else{
                                    response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Database Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;                
                                }                         
                            }else{
                                var message = requestBody.user_email+" added "+requestBody.name+" to skill set",
                                    user_email = requestBody.user_email,
                                    startup_id = null,
                                    task_id = null,
                                    project_id = null,
                                    compartment = null,
                                    private = true;
                                
                                
                                Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                                    response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Skill Added!";//log response
                                    response.data.success = 1;
                                    response.end(JSON.stringify(response.data));   
                                    return;    
                                });                      
                            }
                        });                        
                    }else{
                        response.writeHead(201,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Error Adding New Skill";//log response
                        response.data.success = 0;
                        response.end(JSON.stringify(response.data));   
                        return;                        
                    }
                });                
            }
        }
    });    
}

exports.removeSkill = function(requestBody,response){
    
    response.data = {};
    
    UserSkills.findOne({id: requestBody.skill_id},function(error,data){
        if(error){
              if(response==null){
                response.writeHead(500,{'Content-Type':'application/json'});//set response type
                response.data.log = "Internal Server Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                  
              }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Database Error";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                
              }             
        }else{
            if(data && Object.keys(data).length>0){
                data.remove(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                  
                        }else{
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                
                        }                         
                    }else{
                        var message = requestBody.user_email+" removed skill from skill set",
                            user_email = requestBody.user_email,
                            startup_id = null,
                            task_id = null,
                            project_id = null,
                            compartment = null,
                            private = true;
                                
                                
                        Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(yes){
                            response.writeHead(201,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Skill Added!";//log response
                            response.data.success = 1;
                            response.end(JSON.stringify(response.data));   
                            return;    
                        });                                  
                    }
                });
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                response.data.log = "Record Doesn't Exist";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                      
            }
        }
    })    
}

function toCV(data){
    return new UserCVs({
        user_id: data.user_id,
        max_education: data.max_education,
        introduction_video_url: data.introduction_video_url,
        cover_letter: data.cover_letter,
        date_of_birth: data.date_of_birth
    });
}

function toSocial(data){
    return new UserSocial({
        user_id: data.user_id,
        platform: data.platform,
        url: data.url        
    });
}

function toTool(tool_id,data){
    return new UserTools({
        user_id: data.user_id,
        tool_id: tool_id,
        proof_url: data.proof_url 
    });
}

function toSkill(skill_id,data){
    return new UserSkills({
        user_id: data.user_id,
        skill_id: skill_id,
        proof_url: data.proof_url
    })
}

function toCertificates (data){
    return new UserCertificates({
        user_id: data.user_id,
        type: data.certificate_type,
        name: data.certificate_name,
        specialization: data.specialization,
        year: data.year,
        proof: {
            bucket: data.bucket,
            object: data.object
        }        
    })
}