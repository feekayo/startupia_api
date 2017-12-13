//accounts controllers
var Sessions = require('../models/sessions'),
    Users = require('../models/users'),
    PasswordChange = require('../models/passwordchange'),
    Verification = require('../models/verify'),
    Privileges = require('../models/privileges'),
    CRM_apps = require('../models/CRM/apps'),
    url = require('url');

module.exports = {
    index: function(request,response) {
        response.send("Startupia API");
    },

    login: function(request,response){
        var ip = request.connection.remoteAddress || request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.socket.remoteAddress;
        console.log(ip);
        var get_params = url.parse(request.url,true);

        if((Object.keys(get_params.query).length==2) && (get_params.query.email!=undefined) && (get_params.query.password!=undefined)){
            Users.login(get_params.query,response);
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client                   
        }
    },

    signup: function(request,response){
        if((request.body.fullname != undefined) && (request.body.email != undefined) && (request.body.password != undefined)){
            Users.register(request.body,response);
        }else{
            response.data = {};
            console.log(request);
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client                   
        }
    },

    forgot_password: function(request,response){
        if(request.body.email != undefined){
            PasswordChange.create(request.body,response);
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client              
        }
    },

    confirm: function(request,response){
        Users.confirm_user(request.params.uniq_id,response);
    },

    edit: function(request,response){
        if((request.body.type!=undefined) && (request.body.param!=undefined) && (request.body.user_id!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if (validated) {
                    Users.edit(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            });
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },
    
    verify_session: function(request,response){//for validating sessions
        if(request.body.user_id!=undefined){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                console.log("Error: 1");
                if (validated) {
                    console.log("Error: 2");
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Valid session";//log message for client
                    response.data.success = 1; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client 
                }else{
                    console.log("Error: 3");
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            });
        }else{
            console.log("Error: 4");
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }        
    },
    
    

    verify_email: function(request,response){//for sending email verification codes
        if((request.body.email!=undefined) && (request.body.user_id!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){//async function for validating sessions
                if(validated){
                    Verification.create_for_email(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
                    response.data.log = "Invalid session";
                    response.success = 2;//success variable for client
                    response.end(JSON.stringify(response.data));//send response to client
                }
            });
        }else{
            response.data = {};//declare response array
            response,writeHead(201,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    },

    verify_phone: function(request,response){
        if((request.body.user_id!=undefined)&&(request.body.type!=undefined)&&(request.body.country_code!=undefined)&&(request.body.number!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if (validated) {
                    Verification.create_for_phone(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            });            
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },

    confirm_verify_phone: function(request,response){
        if((request.body.user_id!=undefined)&&(request.body.key!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if (validated) {
                    Verification.confirm_phone(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            }); 
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));
        }
    },

    confirm_verify_email: function(request,response){
        if((request.body.user_id!=undefined)&&(request.body.key!=undefined) && (request.body.email!=undefined)){
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){
                if (validated) {
                    Verification.confirm_email(request.body,response);
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            }); 
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));
        }
    },

    check_passwordchange_token: function(request,response){//function for checking password change variables
        var get_params = url.parse(request.url,true);//parse url

        if((Object.keys(get_params.query).length==2) && (get_params.query.email!=undefined) && (get_params.query.token!=undefined)){//check request params
            PasswordChange.verify_token(get_params.query,response);//perform action
        }else{
            console.log(get_params.query);
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    },

    change_password: function(request,response){//function to change up the user password
        if((request.body.email!=undefined) && (request.body.password!=undefined) && (request.body.token!=undefined)){//check password change variables
            PasswordChange.change_password(request.body,response);//do changing of password
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client            
        }

    },    

    //Delete later on
    login_compartment: function(request,response){
        if((request.body.email!=undefined) && (request.body.password!=undefined) && (request.body.company_id!=undefined) && (request.body.compartment!=undefined)){//add session_id later on

            Users.callback_login(request.body.email,request.body.password,function(success){

                if(success){
                    //success == user_id
                    Privileges.check_privilege_callback(request.body.email,request.body.company_id,request.body.compartment,function(access){
                        if(!access){
                            response.data = {};
                            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Access Denied!"; //log message for client
                            response.data.success = 0;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client                                        
                        }else{
                            //add create session here to make fool proof
                            response.data = {};
                            response.writeHead(200,{'Content-Type':'application/json'});//server response set to json format
                            response.data.log = "Access Granted!"; //log message for client
                            response.data.access_level = access;
                            response.data.user_id = success;
                            response.data.success = 1;//success variable for client
                            response.end(JSON.stringify(response.data));//send response to client
                        }
                    });
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
                    response.data.log = "Invalid Login"; //log message for client
                    response.data.success = 0;//success variable for client
                    response.end(JSON.stringify(response.data));//send response to client 
                }
            });
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 
        }
        
    }
}