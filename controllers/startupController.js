'use strict';

const Sessions = require('../models/sessions'),
    Startups = require('../models/startups');

const saveStartup = ()=>{

}
module.exports = {


    save_startup: function (request, response) {
        if ((request.body.user_id != undefined) &&
            (request.body.name != undefined) &&
            (request.body.email != undefined) &&
            (request.body.type_id != undefined) &&
            (request.body.user_email != undefined) &&
            (request.body.bucket != undefined) &&
            (request.body.object_key != undefined) &&
            (request.params.session_id != undefined) &&
            (request.body.user_id != "") &&
            (request.body.name != "") &&
            (request.body.email != "") &&
            (request.body.type_id != "") &&
            (request.body.user_email != "") &&
            (request.body.bucket != "") &&
            (request.body.object_key != "") &&
            (request.params.session_id != "")) {
            Sessions.validate(request.params.session_id, request.body.user_id, function (validated) {
                if (validated) {
                    Startups.save_startup_queue(request.body, response);
                } else {
                    response.data = {};
                    response.writeHead(201, {'Content-Type': 'application/json'});//server response is in json format
                    response.data.log = "Invalid session";//log message for client
                    response.data.success = 2; // success variable for client
                    response.end(JSON.stringify(response.data)); //send response to client
                }
            });
        } else {
            response.data = {};
            response.writeHead(201, {'Content-Type': 'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 			
        }
    },

    create_startup: function (request, response) {
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
    },


};