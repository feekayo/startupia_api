var mongoose = require("mongoose"),//requirements
	shortid = require("shortid"),
	Sessions = require("./sessions");

var companyMemos = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	memo_body: String,
	startup_id: String,
	memo_header: String,
	memo_originator: String, //user_id of memo originator
	created_at: {type: Date,'default': Date.now}
});

var CompanyMemos = mongoose.model('Memos',companyMemos);

//set up module exports
var exports = module.exports;

exports.model = CompanyMemos;

exports.add = function(memo_body,memo_header,memo_originator,startup_id,callback){
	Memo  = toMemo(memo_body,memo_header,memo_originator,startup_id);

	Memo.save(function(error){
		if(error){
			callback(false);
		}else{
			callback(true);
		}
	});
}

function toMemo(memo_body,memo_header,memo_originator,startup_id){
	return new CompanyMemos({
		memo_body: memo_body,
		memo_header: memo_header,
		memo_originator: memo_originator,
		startup_id: startup_id
	});
}