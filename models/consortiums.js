var mongoose = require('mongoose'),
	shortid = require('shortid');

var consortiumSchema = new mongoose.Schema({

});

var Consortiums = mongoose.model('consortiums',consortiumSchema);

var consortiumMembershipSchema = new mongoose.Schema({

});

var ConsortiumMembership = mongoose.model('consortiums_members',consortiumMembershipSchema);