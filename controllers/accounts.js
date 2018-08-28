//accounts controller controls all account based models, things to do with creating and managing a user's account are done here


let Sessions = require('../models/sessions'), // Session model is required
    Users = require('../models/users'), //users model is required
    PasswordChange = require('../models/passwordchange'), //password change model is required
    Verification = require('../models/verify'), //verification model is required
    Privileges = require('../models/privileges'), //privileges model is required
    url = require('url'); //url parser is required

module.exports = {
    index: function(request,response) { //index link
        response.send("Welcome to Startupia API"); //show welcome message
    },

    get: function(req, response){
        //user automatically injected into the response
        // by the middleware, all needed authorization
        // can then be done as per request basis

        const user = req.user;
        const data = {};

        data.log = "Login Success";
        data.success = 1;
        data.data = user;
        return response.json(data);
    },

    login: function(request,response){ //login function
        let ip = request.connection.remoteAddress || request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.socket.remoteAddress; //check source IP Address
        
        let get_params = url.parse(request.url,true); //parser url with url parser to get GET parameters being sent

        if((Object.keys(get_params.query).length==2) && (get_params.query.email!=undefined) && (get_params.query.password!=undefined) && (get_params.query.email!="") && (get_params.query.password!="")){ //validate request parameters
            get_params.query.source_ip_address = ip;//add ip address to get params for logging
            
            Users.login(get_params.query,response); //perform login action
        }else{
            
            response.data = {}; //set response data object
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success letiable for client
            response.end(JSON.stringify(response.data)); //send response to client                   
        }
    },

    
    signup: function(request,response){
        if((request.body.fullname != undefined) && (request.body.email != undefined) && (request.body.password != undefined) && (request.body.fullname != "") && (request.body.email != "") && (request.body.password != "")){ //Check 
            Users.register(request.body,response);
        }else{
            response.data = {};
            console.log(request);
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success letiable for client
            response.end(JSON.stringify(response.data)); //send response to client                   
        }
    },

    forgot_password: function(request,response){//for sending forgotten password recovery messages
        if(request.body.email != undefined){ //check for user's email address
            PasswordChange.create(request.body,response);
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success letiable for client
            response.end(JSON.stringify(response.data)); //send response to client              
        }
    },

    confirm: function(request,response){ //for email confirmations
        Users.confirm_user(request.params.uniq_id,response); //carry out confirmation action
    },

    edit: function(request,response){ //for editing user profiles
        if((request.body.type!=undefined) && (request.body.param!=undefined) && (request.body.user_id!=undefined)){ //validate request parameters
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){ //validate user session
                if (validated) {
                    Users.edit(request.body,response); //validate editing
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success letiable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            });
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success letiable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },
    
    verify_session: function(request,response){//for validating sessions
        if(request.body.user_id!=undefined && request.body.user_id!=""){ //validate request
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){ 
                if (validated) {
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Valid session";//log message for client
                    response.data.success = 1; // success letiable for client
                    response.end(JSON.stringify(response.data)); //send response to client 
                }else{
                    response.data = {};
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success letiable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            });
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success letiable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }        
    },
    
    

    verify_email: function(request,response){//for creating and sending email verification codes
        if((request.body.email!=undefined) && (request.body.user_id!=undefined) && (request.body.email!="") && (request.body.user_id!="")){ //validate request
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){//async function for validating sessions
                if(validated){//if session is validated
                    Verification.create_for_email(request.body,response); //create verification code for emails
                }else{
                    response.data = {}; 
                    response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
                    response.data.log = "Invalid session";
                    response.success = 2;//success letiable for client
                    response.end(JSON.stringify(response.data));//send response to client
                }
            });
        }else{
            response.data = {};//declare response data array
            response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success letiable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    },

    verify_phone: function(request,response){ //for creating phone number verification token and sending it
        if((request.body.user_id!=undefined)&&(request.body.type!=undefined)&&(request.body.country_code!=undefined)&&(request.body.number!=undefined) && (request.body.user_id!="")&&(request.body.type!="")&&(request.body.country_code!="")&&(request.body.number!="")){ //validate request
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){ // async session validation
                if (validated) {//if validated
                    Verification.create_for_phone(request.body,response); //create validation for phone
                }else{
                    response.data = {}; //create response data object
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success letiable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            });            
        }else{
            response.data = {}; //declare response data array
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success letiable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },

    confirm_verify_phone: function(request,response){ //for confirming phone number verification
        if((request.body.user_id!=undefined)&&(request.body.key!=undefined) && (request.body.user_id!="")&&(request.body.key!="")){//validate request
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){ //async session validation
                if (validated) { //if validated
                    Verification.confirm_phone(request.body,response); //confirm validation code
                }else{
                    response.data = {};//declare response data array
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success letiable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            }); 
        }else{
            response.data = {}; //declare response data array
            response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success letiable for client
            response.end(JSON.stringify(response.data));
        }
    },

    confirm_verify_email: function(request,response){ //for confirming email verification
        if((request.body.user_id!=undefined)&&(request.body.key!=undefined) && (request.body.email!=undefined) && (request.body.user_id!="")&&(request.body.key!="") && (request.body.email!="")){ //validate request
            Sessions.validate(request.params.session_id,request.body.user_id,function(validated){ //async session validation 
                if (validated) { //if validated
                    Verification.confirm_email(request.body,response);//confirm validation code
                }else{
                    response.data = {}; //declare response data array
                    response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success letiable for client
                    response.end(JSON.stringify(response.data)); //send response to client                     
                }
            }); 
        }else{
            response.data = {}; //declare response data array
            response.writeHead(201,{'Content-Type':'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0;//success letiable for client
            response.end(JSON.stringify(response.data));
        }
    },

    check_passwordchange_token: function(request,response){//function for checking password change letiables
        let get_params = url.parse(request.url,true);//parse url

        if((Object.keys(get_params.query).length==2) && (get_params.query.email!=undefined) && (get_params.query.token!=undefined)  && (get_params.query.email!="") && (get_params.query.token!="")){//check request params
            PasswordChange.verify_token(get_params.query,response);//perform action
        }else{
            response.data = {}; //declare response data array
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success letiable for client
            response.end(JSON.stringify(response.data));//send response to client
        }
    },

    change_password: function(request,response){//function to change up the user password
        if((request.body.email!=undefined) && (request.body.password!=undefined) && (request.body.token!=undefined) && (request.body.email!="") && (request.body.password!="") && (request.body.token!="")){//check password change letiables
            PasswordChange.change_password(request.body,response);//do changing of password
        }else{
            response.data = {}; //declare response data array
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete Request"; //log message for client
            response.data.success = 0;//success letiable for client
            response.end(JSON.stringify(response.data));//send response to client            
        }

    },  

   
}