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
		//console.log(session_id+" , "+user_id);
        if(data){
            console.log("Error: 6");
			callback(true);
		}else{
            console.log("Error: 7");
			callback(false);
		}
	});	
}

exports.validate_email = function(session_id,user_id,email,callback){
	console.log("Error: 7");
    Sessions.findOne({$and:[{user_id:user_id},{session_id:session_id}]},function(error,data){
		console.log("Error: 8");
        if(data){
            console.log("Error: 9");
			Users.users_model.findOne({$and: [{id: user_id},{email:email}]},function(error,data){
                console.log("Error: 10");
                if(data){
                    console.log("Error: 11");
                    callback(true);
                }else{
                    console.log(user_id+" "+email);
                    console.log("Error: 12");
                    callback(false);
                }                
            });
		}else{
            console.log("Error: 13");
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