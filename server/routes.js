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
    
    router.put('/user/verify_email/:session_id',accounts.verify_email);//route for sending verification code to user email
    router.post('/user/verify_email/:session_id',accounts.confirm_verify_email);//route for checking and authorizing email verification
  

    app.use(router);
}