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
    //router.put('/user/verify_phone/:session_id',accounts.verify_phone);//route for sending verification code to user phone
    //router.post('/user/verify_phone/:session_id',accounts.confirm_verify_phone);//route for confirming phone verification
    router.get('/user/check_passwordchange_token',accounts.check_passwordchange_token);//check password change token
    router.post('/user/change_password',accounts.change_password);//for updating password
    router.post('/user/verify_session/:session_id',accounts.verify_session);//for verifying passwords
    
    router.put('/user/verify_email/:session_id',accounts.verify_email);//route for sending verification code to user email
    router.post('/user/verify_email/:session_id',accounts.confirm_verify_email);//route for checking and authorizing email verification
  
    router.post('/crm/login',accounts.login_compartment);//route for logging into CRM
    //router.post('/crm/create_app',create.crm_create_app);
    //router.post('/crm/create_product',create.crm_create_product);
    //router.post('/crm/create_button',create.crm_create_button);

    
    //create startup founders, personnel and privileges
    router.put('/create/startup/:session_id',create.save_startup);//route for saving startups in the queue before confirmation    
    router.post('/create/startup/:session_id',create.create_startup);//route for creating startups
    
    //for founder creation and confirmation 
    router.put('/create/founder/:session_id',create.create_founder);//route for creating founder
    router.post('/create/founder/:session_id',create.accept_founder_invite);//route for accepting founder invite
    router.post('/delete/founder_invite/:session_id',remove.reject_founder_invite);//route for rejecting founder invite
    
    
    //for privilege creation and confirmation
    router.put('/create/privilege/:session_id',create.create_privilege);//route for creating personnel privilege
    router.post('/create/privilege/:session_id',create.accept_privilege_invite);//route for creating personnel privilege
    router.post('/delete/privilege_invite/:session_id',remove.reject_privilege_invite);//route for rejecting founder invite
    
    //for personnel creation and confirmation
    router.put('/create/personnel/:session_id',create.create_personnel);//route for sending email invite    
    router.post('/create/personnel/:session_id',create.accept_personnel_invite);//route for accepting personnel invite
    router.post('/delete/job_invite/:session_id',remove.reject_personnel_invite);//route for rejecting founder invite
    
    //validate startup access
    router.get('/read/validate_startup_access/:session_id',read.validate_startup_access);//for validating a user access to a startup
    router.post('/update/validate_personnel/:session_id',update.personnel_verification);//for verifying a user 
        
    
    //user invite routes
    router.get('/read/user_job_invites/:session_id',read.user_personnel_invites);//for fetching a user's job invites
    router.get('/read/user_founder_invites/:session_id',read.user_founder_invites);//for fetching a user's job invites
    router.get('/read/user_privilege_invites/:session_id',read.user_privilege_invites);//for fetching a user's job invites
    
    
    //router.post('/create/click',create.crm_create_click);
    //router.post('/create/order',create.crm_create_order);
    //router.post('/create/near_miss',create.crm_create_near_miss);
    //router.post('/create/product_view',create.crm_create_product_view);

    //router.post('/crm/fetch_products',read.crm_fetch_products);//route for fetching products
    //router.post('/crm/fetch_apps',read.crm_fetch_apps);//route for fetching app

    //router.post('/crm/fetch_orders',read.crm_track_orders);//route for fetching orders
    //router.post('/crm/fetch_near_misses',read.crm_fetch_near_misses);//route for fetching near_misses
    //router.post('/crm/fetch_product_views',read.crm_fetch_product_views);//route for fetching orders

    //router.post('/crm/fetch_app_overview',read.crm_app_stats);//route for fetching orders
    //router.post('/crm/fetch_app_usage',read.crm_live_app_usage);//route for fetching orders

    //read routes 
    router.get('/startups/fetch_invited_founders',read.startup_founders_queue);//route for fetching startup founders queue
    router.get('/startups/fetch_founders',read.startup_founders);//route for fetching startup founders
    router.get('/startups/fetch_personnel',read.startup_personnel);//route for fetching startup personnel
    app.use(router);
}