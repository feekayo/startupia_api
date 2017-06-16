var express = require('express'),
    router = express.Router(),
    //url = require('url'), //download url module
    accounts =require('../controllers/accounts'),//define controllers
    create = require('../controllers/create'),
    read = require('../controllers/read');
    update = require('../controllers/update'),
    remove = require('../controllers/delete');

module.exports = function(app){
    
    //accounts routes
    router.get('/',accounts.index);//hello message
    router.get('/user/login',accounts.login);//login route 
    router.put('/user/register',accounts.signup)//signup route
    router.get('/user/confirm/:uniq_id',accounts.confirm);//account confirmation route
    router.put('/user/forgot_password',accounts.forgot_password);//route for sending forgot password url
    router.post('/user/edit/:session_id',accounts.edit);//route for editting user information
    router.put('/user/verify_phone/:session_id',accounts.verify_phone);//route for sending verification code to user phone
    router.post('/user/verify_phone/:session_id',accounts.confirm_verify_phone);//route for confirming phone verification
    router.get('/user/check_passwordchange_token',accounts.check_passwordchange_token);//check password change token
    router.post('/user/change_password',accounts.change_password);//for updating password

    /****/

    //create routes
    router.put('/create/cv_certificate/:session_id',create.cv_certificate); //create cv certificate
    router.put('/create/cv_project/:session_id',create.cv_project);//create cv project
    router.put('/create/cv_job/:session_id',create.cv_job);//create cv job
    router.put('/create/cv_skill/:session_id',create.cv_skill);//create cv skill
    router.put('/create/cv_tool/:session_id',create.cv_tool);//create cv tool
    router.put('/create/cv_interest/:session_id',create.cv_interest);//create cv interest
    router.put('/create/cv_essay/:session_id',create.cv_essay);//create cv essay
    router.put('/create/cv_social/:session_id',create.cv_social);//create cv social
    
    router.put('/create/startup/:session_id',create.startups);//create startup    
    router.put('/create/founder/:session_id',create.founders);//add founder
    /**

    
    **/

    //read routes
    router.get('/read/user_cv',read.user_cv); // fetch user cv
    router.get('/read/user_skills',read.user_skills);//fetch user skills
    router.get('/read/startup_setup',read.fetch_startup_setup_data);//fetch startup setup data
    router.get('/read/startup_founders',read.fetch_startup_founders);//fetch startup founders data

    /****/
    //update routes
    router.post('/update/startup/:session_id',update.startups); //route  to update startup details
    
    
    //delete routes
    router.delete('/delete/cv_certificate/:session_id',remove.cv_certificate)//route to delete cv certificate
    router.delete('/delete/cv_project/:session_id',remove.cv_project);//delete cv project
    router.delete('/delete/cv_job/:session_id',remove.cv_job);//delete cv job
    router.delete('/delete/cv_skill/:session_id',remove.cv_skill);//delete cv skill
    router.delete('/delete/cv_tool/:session_id',remove.cv_tool);//delete cv tool
    router.delete('/delete/cv_interest/:session_id',remove.cv_interest);//delete cv interest
    router.delete('/delete/cv_essay/:session_id',remove.cv_essay);//delete cv essay
    router.delete('/delete/cv_social/:session_id',remove.cv_social);//delete cv social
    router.delete('/delete/founders/:session_id',remove.founder);//delete startup founder    

    app.use(router);
}