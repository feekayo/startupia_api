var mongoose = require('mongoose'),
	shortid = require('shortid');

var projectSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	name: String,
	startup_id: String,
	admin_id: String,
	team_id: String,
	created_at: {type: Date},
	updated_at: {type: Date, 'default': Date.now}
});

var Projects = mongoose.model('projects',projectSchema);

var moduleSchema = new mongoose.Schema({
	id: {type:String, unique: true, 'default':shortid.generate},
	project_id: String,
	admin_id: String,
	name: String,
	parent_id: String,
	team_id: String,
	created_at: {type: Date, 'default': Date.now}
});

var Modules = mongoose.model('project_modules',moduleSchema)

var taskSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	module_id: String,
	title: String,
	team_id: String,
	done: {type:Boolean, 'default': false},
	due: {type:Date}
	created_at: {type:Date, 'default': Date.now}
});

var Tasks = mongoose.model('project_tasks',taskSchema);

var taskNotesSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	task_id: String,
	note: String,
	user_id: String,
	file: {
		bucket:String,
		object: String
	},
	created_at: {type:Date, 'default': Date.now}
});

var TaskNotes = mongoose.model('project_task_notes',taskNotesSchema);

var teamSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	leader_id: String,
	created_at: {type:Date, 'default': Date.now}
});

var Teams = mongoose.model('project_teams',teamSchema);

var teamMemberSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	created_at: {type:Date, 'default': Date.now}
})
