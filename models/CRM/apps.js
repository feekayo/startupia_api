var mongoose = require("mongoose"),
    shortid = require("shortid");

var CRMappsSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    app_id: String,
    company_id: String,
    app_name: String,
    app_category: String
});

var CRMapps = mongoose.model("CRM_apps", CRMappsSchema);

var CRMButtonsSchema = new mongoose.Schema({
    id: {type: String, unique: true, "default": shortid.generate},
    app_id: String,
    button_id: String,
    button_desc: String
    //app_id: String
});

var CRMButtons = mongoose.model("CRM_buttons", CRMButtonsSchema);

var CRMClicksSchema = new mongoose.Schema({
    id: {type: String, unique: true, "default": shortid.generate},
    app_id: String,
    button_id: String,
    source_ip: String,
    source_platform: String,
    user_email: String,
    timestamp: {type: Date, "default": Date.now}
});

var CRMClicks = mongoose.model("CRM_clicks", CRMClicksSchema);

var exports = module.exports;


exports.fetch_app_data = function (requestBody, response) {
    CRMClicks.find({app_id: requestBody.app_id}, function (error, data) {

        if (data) {

        } else {

        }

        CRMButtons.find({app_id: requestBody.app_id}, function (error, data) {
            if (data) {

            } else {

            }
        })

    });
}

exports.fetch_live_app_usage = function (requestBody, response) {
    CRMClicks.find({app_id: requestBody.app_id}, function (error, data) {
        if (error) {
            console.log(error);//log error
            if (response == null) {//check for error 500
                response.writeHead(500, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "Internal server error";//send message to user
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;
            }
        } else {
            if (data) {

                response.writeHead(201, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "Data Fetched";
                response.data.success = 1;
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send message to user
                return;
            } else {
                response.writeHead(201, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "No Active data";
                response.data.success = 0;
                response.data.data = data;
                response.end(JSON.stringify(response.data));//send message to user
                return;
            }
        }
    });
}

exports.create_app = function (requestBody, response) {
    var id = shortid.generate();

    CRMapp = toApp(id, requestBody);
    CRMapp.save(function (error) {
        response.data = {};
        if (error) {
            console.log(error);//log error
            if (response == null) {//check for error 500
                response.writeHead(500, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "Internal server error";//send message to user
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;
            }
        } else {
            response.writeHead(200, {"Content-Type": "application/json"});//set content resolution variables
            response.data.log = "App Added";
            response.data.id = id;
            response.data.success = 1;
            response.end(JSON.stringify(response.data));
            return;
        }
    })
}

exports.create_button = function (requestBody, response) {

    CRMButtons.find({$and: [{button_id: requestBody.button_id}, {app_id: requestBody.app_id}]}, function (error, data) {
        response.data = {};
        if (error) {
            console.log(error);//log error
            if (response == null) {//check for error 500
                response.writeHead(500, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "Internal server error";//send message to user
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;
            }
        } else {
            if (data && data[0] != null) {
                response.writeHead(201, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "Unique ID already in use";//send message to user
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;
            } else {
                CRMButton = toButton(requestBody);

                CRMButton.save(function (error) {
                    if (error) {
                        if (response == null) {//check for error 500
                            response.writeHead(500, {"Content-Type": "application/json"});//set content resolution variables
                            response.data.log = "Internal server error";//send message to user
                            response.data.success = 0;//failed flag
                            response.end(JSON.stringify(response.data));//send message to user
                            return;
                        }
                    } else {
                        response.writeHead(201, {"Content-Type": "application/json"});//set content resolution variables
                        response.data.log = "Button Added!";//send message to user
                        response.data.success = 1;//failed flag
                        response.end(JSON.stringify(response.data));//send message to user
                        return;
                    }
                })
            }
        }
    });
}

exports.create_click = function (source_ip, requestBody, response) {

    var CRMClick = toClick(requestBody, source_ip);

    CRMClick.save(function (error) {
        response.data = {};
        if (error) {
            console.log(error);//log error
            if (response == null) {//check for error 500
                response.writeHead(500, {"Content-Type": "application/json"});//set content resolution variables
                response.data.log = "Internal server error";//send message to user
                response.data.success = 0;//failed flag
                response.end(JSON.stringify(response.data));//send message to user
                return;
            }
        } else {
            response.writeHead(201, {"Content-Type": "application/json"}); //set content resolution variables
            response.data.log = "Click logged";//send message to user
            response.data.success = 1;//success flag
            response.end(JSON.stringify(response.data));//send message to user
            return;
        }
    });
}

exports.validate_app = function (app_id, company_id, callback) {
    CRMapps.find({$and: [{id: app_id}, {company_id: company_id}]}, function (error, data) {
        if (error) {
            callback(false);
        } else {
            if (data) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

exports.fetch_company_apps_callback = function (company_id, callback) {
    CRMapps.find({company_id: company_id}, function (error, data) {
        if (error) {
            callback(false);
        } else {
            if (data) {
                callback(data);
            } else {
                callback(false);
            }
        }
    });
}

function toClick(data, source_ip) {
    return new CRMClicks({
        button_id: data.button_id,
        app_id: data.app_id,
        source_ip: source_ip,
        source_platform: data.source_platform,
        user_email: data.user_email
    })
}

function toButton(data) {
    return new CRMButtons({
        button_id: data.button_id,
        button_desc: data.button_desc,
        app_id: data.app_id
    });
}

function toApp(id, data) {
    console.log(data.app_id);
    return new CRMapps({
        id: id,
        app_id: data.app_id,
        company_id: data.company_id,
        app_name: data.app_name,
        app_category: data.app_category
    });
}
