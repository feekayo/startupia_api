var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Sessions = require('./sessions'),
    Users = require('./users'),
    SkillsnTools = require('./skillsntools'), 
    Log = require('./logs');

var vacanciesQueueSchema = new mongoose.Schema({
	id: {type: String, unique: true, require: true},
	position_title: {type: String, require: true},
    job_description: {type: String, require: true},
    min_experience: {type: String, require: true},
    age_limit: {type: String, require: true},
    min_education: {type: String,require: true},
    open_positions: {type: String,require: true},
    geo_constraint: String,
    startup_id: {type: String, require: true},
    timestamp: {type:Date, 'default': Date.now }
});

var VacanciesQueue = mongoose.model('VacanciesQueue',vacanciesQueueSchema)

var vacanciesSchema = new mongoose.Schema({
	id: {type: String, unique: true,require: true},
	position_title: {type: String, require: true},
    job_description: {type: String, require: true},
    min_experience: {type: String, require: true},
    age_limit: {type: String, require: true},
    min_education: {type: String,require: true},
    open_positions: {type: String,require: true},
    geo_constraint: String,
    startup_id: {type: String,require: true},
    timestamp: {type:Date, 'default': Date.now }
});

var Vacancies = mongoose.model('Vacancies',vacanciesSchema);

var vacancySkillsSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true,'default': shortid.generate},
    skill_id: {type: String, require: true},
    vacancy_id: {type: String, require: true}
});

var VacancySkills = mongoose.model('VacancySkills',vacancySkillsSchema);

var vacancyToolsSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true, 'default': shortid.generate},
    tool_id: {type: String, require: true},
    vacancy_id: {type: String, require: true}
});

var VacancyTools = mongoose.model('VacancyTools',vacancyToolsSchema);

var vacancyApplicantsSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true, 'default': shortid.generate},
    vacancy_id: {type: String, require: true},
    user_id: {type: String, require: true},
    timestamp: {type: Date, 'default': Date.now}
});

var Application = mongoose.model('VacancyApplicancts',vacancyApplicantsSchema); 

var exports = module.exports;

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

/**
    create vacancy
    add skills
    allow applicants
    fetch applicant cvs
**/

var exports = module.exports;

exports.validate_application_access = function(application_id,user_id,callback){
    Application.findOne({$and: [{id: application_id},{user_id: user_id}]},function(error,data){
        if(error){
            callback(false);
        }else{
            if(data){
                callback(true);
            }else{
                callback(false);
            }
        }                
    });
}

exports.create_vacancy = function(requestBody,response){
    
    response.data = {};
    
    var id = shortid.generate();//generate unique id
    var VacancyQueue = toVacancyQueue(requestBody,id);//create new vacancy queue object
    VacancyQueue.save(function(error){
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
            var message = requestBody.user_email+" instantiated a vacancy",//log message
                user_email = requestBody.user_email, //user email
                startup_id = requestBody.startup_id,//no startup involved
                task_id = null,//no task involved
                project_id = null,//no project involved
                compartment = "HR",
                private = true;

            Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Vacancy Instantiated";//log response
                response.data.vacancy_id = id;
                response.data.success = 1;
                response.end(JSON.stringify(response.data));   
                return; 
            });         

        } 
    });
}

exports.save_vacancy = function(requestBody,response){
    var id = requestBody.vacancy_id;
    response.data = {};      
    VacanciesQueue.findOne({id: id},function(error,data){
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
            if(data){
                var Vacancy = toVacancy(data);
                
                Vacancy.save(function(error){
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
                                                         
                                var message = requestBody.user_email+" created a vacancy",//log message
                                    user_email = requestBody.user_email, //user email
                                    startup_id = requestBody.startup_id,//no startup involved
                                    task_id = null,//no task involved
                                    project_id = null,//no project involved
                                    compartment = "HR",
                                    private = true;
                                Log.create_log_message(message,user_email,startup_id,task_id,project_id,compartment,private,function(logged){//log update      
                                    //send email here
                                    response.writeHead(201,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Vacancy saved!";//log response
                                    response.data.success = 1;
                                    response.end(JSON.stringify(response.data));  
                                });                                    
                           }
                        }); 
                    }
                })
            }else{
                response.writeHead(201,{'Content-Type':'application/json'});//set response type
                response.data.log = "Vacancy not saved";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                 
            }
        }
    })    
}

exports.save_vacancy_skills = function(requestBody,response){
    response.data = {};      
    SkillsnTools.skills.findOne({skill: requestBody.skill},function(error,data){
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
            if(data){
                var skill_id = data.id;                   
                
                //save new vacancy skill
                var Skill = toVacancySkills(skill_id,requestBody.vacancy_id);
                
                Skill.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;  
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                            
                        }
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Skill Added!";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));   
                        return;
                    }
                })
            }else{
               SkillsnTools.create_skill(requestBody.skill,function(skill_id){
                    if(skill_id){
                        //save new vacancy skill
                        var Skill = toVacancySkills(skill_id,requestBody.vacancy_id);

                        Skill.save(function(error){
                            if(error){
                                if(response==null){
                                    response.writeHead(500,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Internal Server Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;  
                                }else{
                                    response.writeHead(200,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Database Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;                            
                                }
                            }else{
                                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                                response.data.log = "Skill Added!";//log response
                                response.data.success = 1;
                                response.end(JSON.stringify(response.data));   
                                return;
                            }
                        });
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Unforessen Error";//log response
                        response.data.success = 0;
                        response.end(JSON.stringify(response.data));   
                        return;                        
                    }
               }); 
            }
        }
    });
    
}

exports.save_vacancy_tools = function(requestBody,response){
    response.data = {};      
    SkillsnTools.tools.findOne({tool: requestBody.tool},function(error,data){
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
            if(data){
                var tool_id = data.id;                   
                
                //save new vacancy skill
                var Tool = toVacancyTools(tool_id,requestBody.vacancy_id);
                
                Tool.save(function(error){
                    if(error){
                        if(response==null){
                            response.writeHead(500,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Internal Server Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;  
                        }else{
                            response.writeHead(200,{'Content-Type':'application/json'});//set response type
                            response.data.log = "Database Error";//log response
                            response.data.success = 0;
                            response.end(JSON.stringify(response.data));   
                            return;                            
                        }
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Tool Added!";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));   
                        return;
                    }
                })
            }else{
               SkillsnTools.create_tool(requestBody.tool,function(tool_id){
                    if(tool_id){
                        //save new vacancy skill
                        var Tool = toVacancyTools(tool_id,requestBody.vacancy_id);

                        Tool.save(function(error){
                            if(error){
                                if(response==null){
                                    response.writeHead(500,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Internal Server Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;  
                                }else{
                                    response.writeHead(200,{'Content-Type':'application/json'});//set response type
                                    response.data.log = "Database Error";//log response
                                    response.data.success = 0;
                                    response.end(JSON.stringify(response.data));   
                                    return;                            
                                }
                            }else{
                                response.writeHead(200,{'Content-Type':'application/json'});//set response type
                                response.data.log = "Tool Added!";//log response
                                response.data.success = 1;
                                response.end(JSON.stringify(response.data));   
                                return;
                            }
                        });
                    }else{
                        response.writeHead(200,{'Content-Type':'application/json'});//set response type
                        response.data.log = "Unforessen Error";//log response
                        response.data.success = 0;
                        response.end(JSON.stringify(response.data));   
                        return;                        
                    }
               }); 
            }
        }
    });
       
}

exports.save_application =  function(requestBody,response){
    response.data = {};    
    Application.findOne({$and: [{user_id:requestBody.user_id},{vacancy_id: requestBody.vacancy_id}]},function(error,data){
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
                response.data.log = "Application Exists";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                 
            }else{
                var Application = toApplication(requestBody);
                Application.save(function(error){
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
                        response.data.log = "Application Saved";//log response
                        response.data.success = 1;
                        response.end(JSON.stringify(response.data));   
                        return; 
                    }
                });                
            }
        }
    });
}

exports.fetch_startup_vacancies = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {startup_id: requestBody.startup_id}
    },{
        $lookup: {
            from: "vacancyapplicancts",
            foreignField: "vacancy_id",
            localField: "id",
            as: "vacancy_applicants"            
        }
    },{
        $project: {
            id: 1,
            position_title: 1,
            job_description: 1,
            min_experience: 1,
            age_limit: 1,
            min_education: 1,
            open_positions: 1,
            geo_constraint: 1,
            startup_id: 1,
            timestamp: 1,            
            applicants_number: {$size: "vacancy_applicants"}
        }
    }]
    


    Vacancies.aggregate(aggregate,function(error,data){
           
        if(error){
            response.end(error);
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
                response.data.log = "No Data Fetched";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                     
            }
            
        }
            
    })
    

}

exports.fetch_vacancy_applicants = function(requestBody,response){
    response.data = {};
    
    var aggregate = [{
        $match: {vacancy_id: requestBody.vacancy_id}        
    },{
        $lookup: {
            from: "users",
            foreignField: "id",
            localField: "user_id",
            as: "user_data"
        }
    },{
        $lookup: {
            from: "user_cvs",
            foreignField: "user_id",
            localField: "user_id",
            as: "user_cv_data"
        }
    },{
        $lookup: {
            from: "user_social",
            foreignField: "user_id",
            localField: "user_id",
            as: "user_social_data"
        }
    },{
        $lookup: {
            from: "user_skills",
            foreignField: "user_id",
            localField: "user_id",
            as: "user_skills_data"
        }
    },{
        $lookup: {
            from: "user_tools",
            foreignField: "user_id",
            localField: "user_id",
            as: "user_tools_data"
        }
    },{
        $lookup: {
            from: "user_certificates",
            foreignField: "user_id",
            localField: "user_id",
            as: "user_certificates_data"
        }
    },{
        $project: {
            id: 1,
            vacancy_id: 1,
            user_id: 1,
            timestamp: 1,            
            user_data: {
                id: 1,
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
            },
            user_cv_data: 1,
            user_social_data: 1,
            user_skills_data: 1,
            user_tools_data: 1,
            user_certificates_data: 1
        }
    }];
    
    Application.findOne(aggregate,function(error,data){
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
                response.data.log = "No Data Fetched";//log response
                response.data.success = 0;
                response.end(JSON.stringify(response.data));   
                return;                     
            }
        }
    })
}

function toVacancyQueue(data,id){
    return new VacanciesQueue({
        id: id,
        position_title: data.position_title,
        job_description: data.job_description,
        min_experience: data.min_experience,
        age_limit: data.age_limit,
        min_education: data.min_education,
        open_positions: data.open_positions,
        geo_constraint: data.geo_constraint,
        startup_id: data.startup_id
    });
}

function toVacancy(data){
    return new Vacancies({
        id: data.id,
        position_title: data.position_title,
        job_description: data.job_description,
        min_experience: data.min_experience,
        age_limit: data.age_limit,
        min_education: data.min_education,
        open_positions: data.open_positions,
        geo_constraint: data.geo_constraint,
        startup_id: data.startup_id
    });    
}

function toVacancySkills(skill_id,vacancy_id){
    return new VacancySkills({
        skill_id: skill_id,
        vacancy_id: vacancy_id        
    })
}

function toVacancyTools(tool_id,vacancy_id){
    return new VacancyTools({
        tool_id: tool_id,
        vacancy_id: vacancy_id
    })
}

function toApplication(data){
    return new Application({
        vacancy_id: data.vacancy_id,
        user_id: data.user_id  
    })
}