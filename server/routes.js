let express = require('express'),
    router = express.Router(),
    fm_expenditure = require('./fmExpenditureRoutes'),
    fm_earning = require('./fmEarningRoutes'),
//url = require('url'), //download url module
    accounts = require('../controllers/accounts'),//define controllers
    create = require('../controllers/create'),
    read = require('../controllers/read'),
    update = require('../controllers/update'),
    remove = require('../controllers/delete');

module.exports = function (app) {
    // console.log('I get here')
    //fm expenditure
    router.use('/expenditure', fm_expenditure);
    router.use('/earning', fm_earning);
    //accounts routes
    router.get('/', accounts.index);//hello message
    router.get('/user/login', accounts.login);//login route
    router.put('/user/register', accounts.signup)//signup route
    router.get('/user/confirm/:uniq_id', accounts.confirm);//account confirmation route
    router.put('/user/forgot_password', accounts.forgot_password);//route for sending forgot password url
    router.post('/user/edit/:session_id', accounts.edit);//route for editting user information
    //router.put('/user/verify_phone/:session_id',accounts.verify_phone);//route for sending verification code to user phone
    //router.post('/user/verify_phone/:session_id',accounts.confirm_verify_phone);//route for confirming phone verification
    router.get('/user/check_passwordchange_token', accounts.check_passwordchange_token);//check password change token
    router.post('/user/change_password', accounts.change_password);//for updating password
    router.post('/user/verify_session/:session_id', accounts.verify_session);//for verifying passwords

    router.put('/user/verify_email/:session_id', accounts.verify_email);//route for sending verification code to user email
    router.post('/user/verify_email/:session_id', accounts.confirm_verify_email);//route for checking and authorizing email verification

    //router.post('/crm/login',accounts.login_compartment);//route for logging into CRM
    //router.post('/crm/create_app',create.crm_create_app);
    //router.post('/crm/create_product',create.crm_create_product);
    //router.post('/crm/create_button',create.crm_create_button);


    //create startup founders, personnel and privileges
    router.put('/create/startup/:session_id', create.save_startup);//route for saving startups in the queue before confirmation
    router.post('/create/startup/:session_id', create.create_startup);//route for creating startups

    //for founder creation and confirmation 
    router.put('/create/founder/:session_id', create.create_founder);//route for creating founder
    router.post('/create/founder/:session_id', create.accept_founder_invite);//route for accepting founder invite
    router.post('/delete/founder_invite/:session_id', remove.reject_founder_invite);//route for rejecting founder invite


    //for privilege creation and confirmation
    router.put('/create/privilege/:session_id', create.create_privilege);//route for creating personnel privilege
    router.post('/create/privilege/:session_id', create.accept_privilege_invite);//route for creating personnel privilege
    router.post('/delete/privilege_invite/:session_id', remove.reject_privilege_invite);//route for rejecting founder invite

    //for personnel creation and confirmation
    router.put('/create/personnel/:session_id', create.create_personnel);//route for sending email invite
    router.post('/create/personnel/:session_id', create.accept_personnel_invite);//route for accepting personnel invite
    router.post('/delete/job_invite/:session_id', remove.reject_personnel_invite);//route for rejecting personnel invite

    //validate startup access
    router.get('/read/validate_startup_access/:session_id', read.validate_startup_access);//for validating a user access to a startup
    router.post('/update/validate_personnel/:session_id', update.personnel_verification);//for verifying a user
    router.post('/delete/retract_validation/:session_id', remove.retract_validation);//for doing the opposite of validation

    //fetch a user's startups
    router.get('/read/user_startups/:session_id', read.fetch_user_startups);//for fetching a user's startups
    router.get('/read/startup_details/:session_id', read.startup_details);//for fetching a singular startup's details

    //HR functions
    router.get('/read/validate_hr_access/:session_id', read.validate_hr_access);//for validating a user access to a startup's hr module
    //router.get('/read/validate_access/:session_id',read.validate_access);//for validating user access to an aspect of work
    router.get('/read/startup_job_invites/:session_id', read.startup_job_invites);//for fetching a startup's job invites
    router.post('/update/job_invite/:session_id', update.job_invite);// for updating job invites
    router.get('/read/job_invite/:session_id', read.personnel_invite);//for fetching a singular job invite
    router.post('/delete/remove_job_invite/:session_id', remove.delete_job_invites);//for deleting job invites
    router.get('/read/unvalidated_staff/:session_id', read.unvalidated_staff);//for fetching list of staff in need of validation
    router.put('/create/vacancy/:session_id', create.create_vacancy);//for saving vacancies to buffer collection
    router.put('/create/vacancy_skill/:session_id', create.create_vacancy_skill);//for saving a vacancy's required skills
    router.put('/create/vacancy_tool/:session_id', create.create_vacancy_tool);//for saving a vacancy's required tools
    router.post('/create/vacancy/:session_id', create.save_vacancy);//for saving vacancies permanently
    router.get('/read/vacancies/:session_id', read.startup_vacancies);
    
    //FOR HR interviews
    //Fetching Means
    router.get('/read/interview/admin/:session_id',read.admin_interview_room);//for fetching admin interviews **
    router.get('/read/interview/applicant/:session_id',read.user_interview_room);//for fetching admin interviews **
    
    //Uploading Files
    router.put('/create/interview/file/admin/:session_id',create.admin_interview_file);//for uploading admin files **
    router.put('/create/interview/file/applicant/:session_id',create.user_interview_file);//for uploading user files **
    
    //Sending Messages
    router.put('/create/interview/message/admin/:session_id',create.admin_interview_message);//for creating admin interview messages **
    router.put('/create/interview/message/applicant/:session_id',create.user_interview_message);//for creating applicant interview messages **
    
    //Terminating Interviews
    router.post('/update/terminate_interview/admin/:session_id',update.admin_terminate_interview)//for terminating an interview admin **
    router.post('/update/terminate_interview/applicant/:session_id',update.user_terminate_interview)//for terminating an interview admin 

    //user invite routes
    router.get('/read/user_job_invites/:session_id', read.user_personnel_invites);//for fetching a user's job invites
    router.get('/read/user_founder_invites/:session_id', read.user_founder_invites);//for fetching a user's job invites
    router.get('/read/user_privilege_invites/:session_id', read.user_privilege_invites);//for fetching a user's job invites


    //user CV creation
    router.put('/create/user_cv/:session_id', create.user_cv);//for adding a user's cv
    router.put('/create/user_certificate/:session_id', create.user_certificate);//for adding a user's certificates to CV
    router.put('/create/user_skill/:session_id', create.user_skill);//for adding user's skills to cv
    router.put('/create/user_tool/:session_id', create.user_tool);//for adding user's tools to cv
    router.put('/create/user_social/:session_id', create.user_social);//for adding user's social media profile to cv

    //fetching User CV data
    router.get('/read/user_cv', read.user_cv); //for fetching user's cv
    router.get('/read/user_certificates', read.user_certificates);//for fetching a user's certificate
    router.get('/read/user_skills', read.user_skills);//for fetching user skills
    router.get('/read/user_tools', read.user_tools);//for fetching user tools
    router.get('/read/user_socials', read.user_socials);//for fetching user socials

    //updating user CV data
    router.post('/update/user_cv/:session_id', update.user_cv);//for updating a user's CV
    router.post('/update/user_social', update.user_social);//for updating a user's social media profile

    //deleting skills, tools and certificates
    router.post('/delete/user_certificate/:session_id', remove.user_certificate);//for deleting a user certificate
    router.post('/delete/user_skill/:session_id', remove.user_skill);//for deleting a user's skill
    router.post('/delete/user_tool/:session_id', remove.user_tool);//for deleting a user's skill


    //Financial Management Routes
    router.get('/read/validate_fm_access/:session_id', read.validate_fm_access);//for validating a user access to a startup's FM module


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
    router.get('/startups/fetch_invited_founders', read.startup_founders_queue);//route for fetching startup founders queue
    router.get('/startups/fetch_founders', read.startup_founders);//route for fetching startup founders
    router.get('/startups/fetch_personnel', read.startup_personnel);//route for fetching startup personnel
    app.use(router);
}