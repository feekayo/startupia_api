var mongoose = require('mongoose'),
	shortid = require('shortid');

var productsSchema = new mongoose.Schema({
	id: {type:String, unique:true, 'default':shortid.generate},
	startup_id: String,
	name: String,
	description: String,
	version: String,
	url: String,
	created_at: {type:Date,'default':Date.now}
});
var Products = mongoose.model('products',productsSchema);

var productFeaturesSchema = new mongoose.Schema({
	id: {type:String, unique:true, 'default':shortid.generate},
	product_id: String,
	feature: String,
	details: String,
	url: String,
	created_at: {type:Date,'default':Date.now} 
});
var Features = mongoose.model('product_features',productFeaturesSchema)
