var Sessions = require('../models/sessions'),
	Users = require('../models/users'),
	Privileges = require('../models/privileges'),
	Startups = require('../models/startups'),
	CRM_apps = require('../models/CRM/apps'),
	CRM_products = require('../models/CRM/products'),
	url = require('url');

module.exports = {
    
    validate_startup_access: function(request,response){
        var get_params = url.parse(request.url,true);
        
        if((Object.keys(get_params.query).length==2) && (get_params.query.user_email!=undefined) && (get_params.query.startup_id)){
            Privileges.validate_startup_access(get_params.query.user_email,get_params.query.startup_id,response);
        }else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client             
        }
    },
    
	crm_fetch_apps: function(request,response){
		if(request.body.company_id!=undefined){
			CRM_apps.fetch_apps_callback(request.body.company_id,function(apps){
				if(apps){
					response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "Apps Fetched";//log message for client
		            response.data.apps = apps;
		            response.data.success = 1; // success variable for client
		            response.end(JSON.stringify(response.data)); //send response to client 	
				}else{
		            response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "No Apps";//log message for client
		            response.data.apps = {};
		            response.data.success = 0; // success variable for client
		            response.end(JSON.stringify(response.data)); //send response to client 	
				}
			});
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 				
		}
	},

	crm_fetch_products: function(request,response){
		if(request.body.company_id!=undefined){
			CRM_products.fetch_products_callback(request.body.company_id,function(products){
				if(apps){
		            response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "Products ";//log message for client
		            response.data.apps = products;
		            response.data.success = 1; // success variable for client
		            response.end(JSON.stringify(response.data)); //send response to client 
				}else{
		            response.data = {};
		            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
		            response.data.log = "No products";//log message for client
		            response.data.apps = {};
		            response.data.success = 0; // success variable for client
		            response.end(JSON.stringify(response.data)); //send response to client 	
				}
			});
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 				
		}
	},	

	crm_track_orders: function(request,response){
		if(request.body.product_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_products.fetch_orders(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_app_stats: function(request,response){
		console.log(request.body.app_id);
		if(request.body.app_id!=undefined){
			//response.data = {};
			//CRM_apps.fetch_app_data(request.body,response);


			response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Data Fetched";//log message for client
            response.data.clicks = 10;
            response.data.buttons = 2;
            response.data.success = 1; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_live_app_usage: function(request,response){
		if(request.body.app_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_apps.fetch_live_app_usage(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_fetch_near_misses: function(request,response){
		if(request.body.product_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_products.fetch_near_misses(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	crm_fetch_product_views: function(request,response){
		if(request.body.product_id!=undefined && request.body.interval!=undefined){
			response.data = {};
			CRM_products.fetch_product_views(request.body,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	startup_founders_queue: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.startup_id!=undefined){
			Startups.fetch_founders_queue(get_params.query,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},
    
	startup_founders: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.startup_id!=undefined){
			Startups.startup_founders(get_params.query.startup_id,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	},

	startup_personnel: function(request,response){
		var get_params = url.parse(request.url,true);

		if(get_params.query.startup_id!=undefined){
			Startups.startup_personnel(get_params.query.startup_id,response);
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type' : 'application/json'});//server response is in json format
            response.data.log = "Incomplete Request";//log message for client
            response.data.success = 0; // success variable for client
            response.end(JSON.stringify(response.data)); //send response to client 			
		}
	}
} 