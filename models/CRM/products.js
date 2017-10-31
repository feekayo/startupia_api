var mongoose = require("mongoose"),
	shortid = require("shortid");

var CRMProductsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default':shortid.generate},
	company_id: String,
	product_id: String,
	product_name: String,
	product_category_id: String,
	product_price: String,
	price_currency: String
});

var CRMProducts = mongoose.model('CRM_products',CRMProductsSchema);

var CRMNearMissesSchema = new mongoose.Schema({
	id: {type: String, unique: true,  'default': shortid.generate},
	client_email: String,//primary identifier for app user
	platform_id: String,
	source_ip_address: String,
	product_id: String,
	timestamp: {type: Date, 'default': Date.now}
});

var CRMNearMisses = mongoose.model('CRM_near_misses',CRMNearMissesSchema);

var CRMProductViewsSchema = new mongoose.Schema({
	id: {type: String, unique: true,  'default': shortid.generate},
	client_email: String,//primary identifier for app user
	platform_id: String,
	source_ip_address: String,
	product_id: String,
	timestamp: {type: Date, 'default': Date.now}
});

var CRMProductViews = mongoose.model('CRM_product_views',CRMProductViewsSchema);


var CRMordersSchema = new mongoose.Schema({
	id: {type: String, unique: true,  'default': shortid.generate},
	client_email: String,//primary identifier for app user
	platform_id: String,
	source_ip_address: String,
	product_id: String,
	timestamp: {type: Date, 'default': Date.now},
	status: String
});

var CRMorders = mongoose.model('CRM_orders',CRMordersSchema);

var exports = module.exports;

exports.create_near_misses = function(ip,requestBody,response){
	
	NearMiss = toNearMisses(ip,requestBody);

	NearMiss.save(function(error){
		if(error){
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
			response.data.log = "NearMiss Logged";
			response.data.success = 1;
			response.end(JSON.stringify(response.data));
			return;			
		}
	});
}

exports.create_product = function(requestBody,response){
	response.data = {};
	CRMProducts.find({$and: [{company_id:requestBody.company_id},{product_id:requestBody.product_id}]},function(error,data){
		if(error){
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			if(data && data[0]!=null){
				console.log(data);
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Product ID already in use";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
				return;	
			}else{
				var Product = toProduct(requestBody);
				Product.save(function(errror){
					if(error){
						console.log(error);//log error
						if(response==null){//check for error 500
							response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
							response.data.log = "Internal server error";//send message to user
							response.data.success = 0;//failed flag
							response.end(JSON.stringify(response.data));//send message to user
							return;
						}
					}else{
						response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
						response.data.log = "Product Added!";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
						return;	
					}
				});
			}
		}
	})
	
}

exports.create_order = function(ip,requestBody,response){
	
	var Order = toOrder(ip,requestBody);

	Order.save(function(error){
		if(error){
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			response.writeHead(200,{'Content-Type':'application/json'});//set content resolution variables
			response.data.log = "Order Logged!";
			response.data.id = id;
			response.data.success = 1;
			response.end(JSON.stringify(response.data));
			return;			
		}
	});
}

exports.fetch_company_products_callback = function(company_id,callback){
	CRMProducts.find({company_id:company_id},function(error,data){
		if(error){
			callback(false);
		}else{
			if(data){
				callback(data);
			}else{
				callback(false);
			}
		}
	});
}

exports.fetch_orders = function(requestBody,response){
	CRMorders.find({product_id:requestBody.product_id},function(error,data){
		if(error){
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			if(data){
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Data Fetched";
				response.data.success = 1;
				response.data.data = data;
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}else{
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "No Active data";
				response.data.success = 0;
				response.data.data = data;
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}
	});
}

exports.fetch_near_misses = function(requestBody,response){
	CRMNearMisses.find({product_id:requestBody.product_id},function(error,data){
		if(error){
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			if(data){
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Data Fetched";
				response.data.success = 1;
				response.data.data = data;
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}else{
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "No Active data";
				response.data.success = 0;
				response.data.data = data;
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}
	});
}

exports.fetch_product_views = function(requestBody,response){
	CRMProductViews.find({product_id:requestBody.product_id},function(error,data){
		if(error){
			console.log(error);//log error
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Internal server error";//send message to user
				response.data.success = 0;//failed flag
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}else{
			if(data){
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "Data Fetched";
				response.data.success = 1;
				response.data.data = data;
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}else{
				response.writeHead(201,{'Content-Type':'application/json'});//set content resolution variables
				response.data.log = "No Active data";
				response.data.success = 0;
				response.data.data = data;
				response.end(JSON.stringify(response.data));//send message to user
				return;
			}
		}
	});
}


function toProduct(data){
	return new CRMProducts({
		company_id: data.company_id,
		product_id: data.product_id,
		product_name: data.product_name,
		product_category_id: data.product_category_id,
		product_price: data.product_price,
		price_currency: data.price_currency
	})
}

function toOrder(ip,data) {
	return new CRMorders({
		client_email: data.client_email,
		platform_id: data.platform_id,
		product_id: data.product_id,
		source_ip_address: ip,
		status: data.status
	});
}

function toNearMisses(ip,data) {
	return new CRMNearMisses({
		client_email: data.client_email,
		platform_id: data.platform_id,
		product_id: data.product_id,
		source_ip_address: ip
	});
}

function toProductView(ip,data) {
	return new CRMProductViews({
		client_email: data.client_email,
		platform_id: data.platform_id,
		product_id: data.product_id,
		source_ip_address: ip
	});
}