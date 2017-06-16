var mongoose = require('mongoose'),
	shortid = require('shortid');

var consultSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	skill_id: String, 
	user_id: String,
	per_hour: String
});

var Consult = mongoose.model('consult',consultSchema);

var consultReviewSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	consult_id: String,
	rating: Number,
	user_id: String,
	review: String,
	created_at: {type:Date,'default':Date.now},
});

var ConsultReview = mongoose.model('consult_rating',consultReviewSchema);

var consultationSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	consult_id: String,
	start_time: Date,
	end_time: Date
	chat_room_id: String;
});

var Consultation = mongoose.model('consultation',consultationSchema); 

