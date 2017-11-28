var mongoose = require('mongoose'),
	shortid = require('shortid'),
    Users = require('./users');

var sessionsSchema = new mongoose.Schema({
    id: {type: String, unique: true, 'default': shortid.generate},
    session_id: String,
    user_id : String,
    created_at : {type: Date, 'default': Date.now}
});

var Sessions = mongoose.model('Sessions',sessionsSchema);

var exports = module.exports;

exports.create = function(session_id,user_id,callback){
	Sessions.remove({user_id: user_id},function(error){//find user's previous sessions
		var Session = toSession(user_id,session_id);

		Session.save(function(error){
			if(error){
				callback(false);
			}else{
				callback(true);
			}
		});
	});
}

exports.validate = function(session_id,user_id,callback){
	Sessions.findOne({$and:[{user_id:user_id},{session_id:session_id}]},function(error,data){
		if(data){
			callback(true);
		}else{
			callback(false);
		}
	});	
}

exports.validate_email = function(session_id, user_id,email,callback){
	Sessions.findOne({$and:[{user_id:user_id},{session_id:session_id}]},function(error,data){
		if(data){
			Users.users_model.findOne({$and: [{id: user_id},{email:email}]},function(error,data){
                if(data){
                    callback(true);
                }else{
                    callback(false);
                }                
            });
		}else{
			callback(false);
		}
	});	    
}
function toSession(user_id,session_id){

	return new Sessions({
		session_id: session_id,
		user_id: user_id
	});
}