var mongoose = require('mongoose'),
	shortid = require('shortid');

var chatRoomSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	type_id: String,
	name: String,
	timestamp: {type: Date, 'default': Date.now}
});

var ChatRoom = mongoose.model('chat_room',chatRoomSchema);

var chatMemberSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	room_id: String,
	user_id: String,
	timestamp: {type: Date, 'default': Date.now} 
	online: {type: Boolean, 'default': false},
	temporary: {type: Boolean, 'default': false},
	terminates: {type: Date}
});

var ChatMember = mongoose.model('chat_member',chatMemberSchema);

var chatMessageSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	sender_id: String,
	file: {
		bucket: String,
		object: String
	},
	message: String,
	room_id: String,
	timestamp: {type: Date, 'default': Date.now} 
});

var ChatMessage = mongoose.model('chat_message',chatMessageSchema);

var chatSeenSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	message_id: String,
	user_id: String,
	timestamp: {type: Date, 'default': Date.now} 
});

var ChatSeen = mongoose.model('chat_seen',chatSeenSchema);


var chatTagsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	tag_id: String,
	message_id: String,
	room_id: String
});

var ChatTags = mongoose.model('chat_tags',chatTagsSchema);

var messageTagSchema = new mongoose.Schema({
	id:{type: String, unique: true, 'default': shortid.generate},
	hashtag: String
});

var MessageTags = mongoose.model('message_tags',messageTagSchema);

var exports = module.exports;

exports.create_chatroom = function(requestBody,response){
	response.data = {};//declare data response array


} 

exports.create_chat_member = function(requestBody,response){
	response.data = {}; //declare data response array

}

exports.create_chat_message = function(requestBody,response){
	response.data = {}; //declare data response array
}

function toChatSeen(data){
	return new ChatSeen({
		message_id: data.message_id,
		user_id: data.user_id,
	});
}

function toChatMember(data){
	return new ChatMember({
		room_id: data.room_id,
		user_id: data.user_id,
		temporary: data.temporary,
		terminates: data.terminates
	});
}

function toChatRoom(data){
	return new ChatRoom({
		type_id: data.type_id,
		name: data.name,
	});
}

function toChatMessage(data){
	return new ChatMessage({
		sender_id: data.sender_id,
		file: {
			bucket: data.bucket,
			object: data.file_object
		},
		message: data.message,
		room_id: data.room_id
	});
}

function parseMessageTags(message){
	
}