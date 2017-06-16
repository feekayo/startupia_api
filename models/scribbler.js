var mongoose = require('mongoose'),
	shortid = require('shortid');

var scribbleSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	article: String,
	published: {type: Boolean,'default': false},
	created_at: {type: Date},
	updated_at: {type: Date, 'default':Date.now}
});

var Scribbles = mongoose.model('scribbles',scribbleSchema);

var scribbleViewsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default':shortid.generate},
	scribble_id: String,
	user_id: String,
	created_at: {type: Date, 'default':Date.now}
})

var ScribbleViews = mongoose.model('scribble_views',scribbleViewsSchema);


var scribbleRatingSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	skill_id: String,
	rating: String,
	scribble_id: String,
	created_at: {type: Date, 'default':Date.now}
}) 

var ScribbleRatings = mongoose.model('scribble_ratings',scribbleRatingSchema);

var scribbleTagsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default':shortid.generate},
	scribble_id: String,
	skill_id: String,
	created_at: {type: Date, 'default':Date.now}
});

var ScribbleTags = mongoose.model('scribble_tags',scribbleTagsSchema);