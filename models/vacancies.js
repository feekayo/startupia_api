var mongoose = require("mongoose"),
    shortid = require("shortid"),
    Sessions = require('./sessions'),
    Users = require('./users');

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

/**
    create vacancy
    add skills
    allow applicants
    fetch applicant cvs
**/

var exports = module.exports;

exports.create_vacancy = function(requestBody,response){
    
}

exports.save_vacancy_skills = function(requestBody,response){
    
}

exports.save_application =  function(requestBody,response){
    
}

exports.fetch_vacancy_applicants = function(requestBody,response){
    
}