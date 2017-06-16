var mongoose = require('mongoose'),
	shortid = require('shortid');

var pdCourseSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	skill_id: String,
	teacher_id: String,
	fee: Number,
	course_duration: Number,
	start_date: {type:Date},
	created_at: {type:Date, 'default':Date.now},
	ended: {type:Boolean,'default':false}
});

var PdCourses = mongoose.model('pd_courses',pdCourseSchema);

var pdLessonsSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	course_id: String,
	release_date: Number,
	file: {
		bucket: String,
		object: String
	},
	text: String,
	created_at: {type:Date},
	updated_at: {type:Date,'default':Date.now}
});

var PdLessons = mongoose.model('pd_lessons',pdLessonsSchema);

var pdTestsSchema = new mongoose.Schema({
	id: {type: String,unique: true,'default':shortid.generate},
	course_id: String,
	release_day: Number,
	text: String,
	file: {
		bucket: String,
		object: String
	},
	submission_deadline: Number,
	created_at: {type: Date},
	updated_at: {type:Date,'default':Date.now}
});

var PdTests = mongoose.model('pd_tests',pdTestsSchema);

var pdTestGradesSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	test_id: String,
	grade_id: String,
	critic: String
});

var PdTestGrades = mongoose.model('pd_test_grades',pdTestGradesSchema);

var pdTestSubmissionsSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default': shortid.generate},
	test_id: String,
	file: {
		bucket: String,
		object: String
	},
	created_at: {type: Date,'default':Date.now}
});

var PdTestSubmissions = mongoose.model('pd_test_submissions',pdTestSubmissionsSchema);

var pdGradesSchema = new mongoose.Schema({
	id: {type: String,unique:true,'default': shortid.generate},
	grades: String
});

var PdGrades = mongoose.model('pd_grades',pdGradesSchema);