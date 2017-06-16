var mongoose = require('mongoose'),
	shortid = require('shortid');

var walletSchema = new mongoose.Schema({
	id: {type:String, unique: true},
	type: String,
	admin_id: String,
	created_at: {type: Date, 'default': Date.now},
	balance: Number
});

var walletBalanceSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	wallet_id: String,
	dateTime: {type: Date, 'default':Date.now},
	balance: String,
});

var walletTranscations = new mongoose.Schema({
	id: {type: String,unique:true,'default':shortid.generate},
	wallet_id: String,
	from: String,
	to: String
	reason: String,
	credit: Number,
	debit: Number,
	balance: Number,
	timestamp: {type: Date,'default':Date.now},
});

var exports = module.exports;