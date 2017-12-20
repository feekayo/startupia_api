var mongoose = require("mongoose"),
    shortid = require("shortid");

var logSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	message: {type: String, required: true},
    user_email: {type: String, required: true},
    startup_id: {type: String},
    task_id: String,
    project_id: String,
    compartment: String,
    private: {type: Boolean},
    timestamp: {type:Date, 'default': Date.now }
});

var Log = mongoose.model('Log',logSchema)


var exports = module.exports;

exports.create_log_message = function(message,user_email,startup_id,task_id,project_id,compartment,private,callback){
    var Log = toLog(message,user_email,startup_id,task_id,project_id,compartment,private);
    
    Log.save(function(error){
        if(error){
            callback(false);
        }else{
            callback(true);
        }
    })
}
   
exports.fetch_startup_logs = function(requestBody,response){
    //fetch where startup_id: startup_id, private: false
}

exports.fetch_compartment_logs = function(requestBody,response){
    //fetch where startup_id: startup_id, compartment: compartment
}

exports.fetch_user_logs = function(requestBody,response){
    //fetch where user_email: user_email
}

exports.fetch_user_company_work_logs = function(requestBody,response){
    //fetch where user_email: user_email, startup_id: startup_id
}

exports.fetch_user_compartment_work_logs = function(requestBody,response){
    //fetch where user_email: user_email, startup_id: startup_id, compartment: compartment
}

exports.fetch_user_project_work_logs = function(requestBody,response){
    //fetch where user_email: user_email, startup_id: startup_id, project_id: project_id
}

function toLog(message,user_email,startup_id,task_id,project_id,compartment,private){
    return new Log({
		message: message,
        user_email: user_email,
        startup_id: startup_id,
        task_id: task_id,
        project_id: project_id,
        compartment: compartment,
        private: private
	});
}