'use strict';
let mongoose = require("mongoose"),//requirements
    shortid = require("shortid"),
    Sessions = require("./sessions"),
    Log = require('./logs');

let sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);


let fmExpenditureSchema = new mongoose.Schema({
    id: {type: String, unique: true, 'default': shortid.generate},
    startup_id: {type: 'String', require: true},
    log_message: {type: 'String', require: true},
    expenditure: {type: 'Number', require: true},
    proof: {
        bucket: String,
        object_key: String
    },

   // cause: {type: ENUM('product_development', 'staff_salaries', 'recurrent_fees', 'others'), require: true},
    cause: {type: 'String', require: true},
    updated_at: {type: Date, 'default': Date.now},
    created_at: {type: Date, 'default': Date.now}
});

let fmExpenditure = mongoose.model('fm_expenditure', fmExpenditureSchema);//intialize data model instance


//setup module exports

//let exports = module.exports;

module.exports.fmExpenditureModel = fmExpenditure;

