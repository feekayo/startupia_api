//read controllers
var Sessions = require("../models/sessions"),
	Users = require("../models/users"),
	CV = require("../models/cv"),
    Startups = require('../models/startups'),
    Founders = require('../models/founders'),
    PasswordChange = require('../models/passwordchange'),
	url = require('url');

module.exports = {
    user_cv: function(request,response){
    	var get_params = url.parse(request.url,true);

    	if((Object.keys(get_params.query).length==1) && (get_params.query.user_id!=undefined)){
    		CV.fetch_cv(get_params.query,response);
    	}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client    		
    	}
    },
    user_skills: function(request,response){//for fetching user skills
        var get_params = url.parse(request.url,true);//parse url
        if((Object.keys(get_params.query).length==1) && (get_params.query.user_id!=undefined)){
            CV.fetch_skills(get_params.query,response);
        }else{
            console.log(get_params);
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },
    fetch_startup_setup_data: function(request,response){ //function for loading up startup instance
        var get_params = url.parse(request.url,true);//parse url

        if((Object.keys(get_params.query).length==3) && (get_params.query.token!=undefined) && (get_params.query.email!=undefined) && (get_params.query.user_id!=undefined)){
            Startups.fetch_startup_setup(get_params.query,response);
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client            
        }
    },
    fetch_startup_founders: function(request,response){//function fo fetching startup founders
         var get_params = url.parse(request.url,true);//parse url

        if((Object.keys(get_params.query).length==1) && (get_params.query.startup_id!=undefined)){//check request params
            Founders.startup_founders(get_params.query.startup_id,response)
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client            
        }
    }

}