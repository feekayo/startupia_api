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
    timestamp: {type:Date, 'default': Date.now}
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
    
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{private: false}]}       
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1,
                location: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    });
}

exports.fetch_compartment_logs = function(requestBody,response){
    //fetch where startup_id: startup_id, compartment: compartment
    
    //fetch where startup_id: startup_id, private: false
    
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{compartment: requestBody.compartment}]}        
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    })

}

exports.fetch_user_logs = function(requestBody,response){
    //fetch where user_email: user_email
    response.data = {};
    
    var aggregate = [{
        $match: {user_email: requestBody.user_email}        
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    })
    
}

exports.fetch_user_company_work_logs = function(requestBody,response){
    //fetch where user_email: user_email, startup_id: startup_id
    
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{user_email: requestBody.personnel_email}]}        
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    })

}

exports.fetch_user_compartment_work_logs = function(requestBody,response){
    //fetch where user_email: user_email, startup_id: startup_id, compartment: compartment
    
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{compartment: requestBody.compartment},{user_email: requestBody.personnel_email}]}        
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    })

}

exports.fetch_user_project_work_logs = function(requestBody,response){
    //fetch where user_email: user_email, startup_id: startup_id, project_id: project_id
    
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{project_id: requestBody.project_id},{user_email: requestBody.personnel_email},{private: false}]}        
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    })
    
}

exports.fetch_project_work_logs = function(requestBody,response){
 //fetch where user_email: user_email, startup_id: startup_id, project_id: project_id
 
    response.data = {};
    
    var aggregate = [{
        $match: {$and: [{startup_id: requestBody.startup_id},{project_id: requestBody.project_id},{private: false}]}        
    },{
        $lookup: {
            from: "users",
            foreignField: "email",
            localField: "user_email",
            as: "user_data"
        }
    },{
        $project: {
            id: 1,
            message: 1,
            user_email: 1,
            startup_id: 1,
            task_id: 1,
            project_id: 1,
            compartment: 1,
            private: 1,
            timestamp: 1,
            user_data: {
                id: 1,
                fullname: 1,
                dp: 1,
                bio: 1
            }
        }
    },{
        $skip: (requestBody.page_number-1) * 50
    },{
        $limit: 50
    },{
        $sort: {'timestamp': -1}
    }];
    
    
    Log.aggregate(aggregate,function(error,data){
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
            if(data && Object.keys(data).length>0){
                response.writeHead(201,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 1;//flag success
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                 
            }else{
                response.writeHead(200,{'Content-Type':'application/json'});//setcontent resolution variables
                response.data.log = "Database Error";//log message for client
                response.data.success = 0;//flag success
                response.end(JSON.stringify(response.data));//send response to client
                return;//return statement                  
            }
        }
    })
    
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