//update controllers
var Sessions = require("../models/sessions"),
	Users = require('../models/users'),
    Startups = require('../models/startups'),
    Founders = require('../models/founders');

module.exports = {
   //update startups
   startups: function(request,response){
        if((request.params.session_id!=undefined)&&(request.body.user_id!=undefined)&&(request.body.startup_id!=undefined)&&(request.body.type!=undefined)&&(request.body.param!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if(validated){
                    Startups.update(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 0;//success variable for client
                    response.end(JSON.stringify(response.data));//send response to client
                }
            });
        }else{
            response.data = {};
            response.writeHead(200,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    },	    
}