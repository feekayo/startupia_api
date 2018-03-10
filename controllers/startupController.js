'use strict';

const Sessions = require('../models/sessions'),
    Startups = require('../models/startups');


//in charge of sending error messages to client
const ErrHandler = (response, message, succ_variable) => {
    response.data = {};
    response.writeHead(400, {'Content-Type': 'application/json'});//server response set to json format
    response.data.log = message; //log message for client
    response.data.success = succ_variable;//success variable for client
    response.end(JSON.stringify(response.data));//send response to client
};


const saveStartup = (request, response) => {
    let required = ['user_id', 'name', 'email', 'type_id', 'user_email', 'bucket', 'object_key'];

    //Make sure client's session is valid and then make sure all the required parameters were sent
    if (typeof(request.params.sesion_id) !== 'undefined'
        && request.params.sesion_id.length > 0) {

        //loop through required array and bounce user as soon as a param is missing
        required.map(req_ => {
            if (!req.body.hasOwnProperty(req_) || req.body[req_].length < 1) {
                return ErrHandler(response, 'incomplete data', 0);
            }
        });

        //make sure user session is valid
        Sessions.validate(request.params.session_id, request.body.user_id, function (validated) {
            if (validated) {
                Startups.save_startup_queue(request.body, response);
            } else {
                ErrHandler(response, "Invalid session", 2)
            }
        });
    } else {
        return ErrHandler(response, 'incomplete data', 0);
    }

};

const createStartup = (request, response) => {
    if ((request.body.user_id != undefined) && (request.body.id != undefined) && (request.body.user_email != undefined) && (request.body.user_id != "") && (request.body.id != "") && (request.body.user_email != "")) {
        Sessions.validate(request.params.session_id, request.body.user_id, function (validated) {
            if (validated) {
                Startups.create_startup(request.body, response);
            } else {
                response.data = {};
                response.writeHead(201, {'Content-Type': 'application/json'});//server response is in json format
                response.data.log = "Invalid session";//log message for client
                response.data.success = 2; // success variable for client
                response.end(JSON.stringify(response.data)); //send response to client
            }
        });
    } else {
        console.log(request.body);
        response.data = {};
        response.writeHead(201, {'Content-Type': 'application/json'});//server response set to json format
        response.data.log = "Incomplete data"; //log message for client
        response.data.success = 0;//success variable for client
        response.end(JSON.stringify(response.data));//send response to client
    }
};
module.exports = {
    save_startup: saveStartup,

    create_startup: createStartup
};