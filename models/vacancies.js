var mongoose =require('mongoose'),
	shortid = require('shortid');


//vacancy
var vacanciesSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	startup_id: String,
	position: String,
	type: String, //contract or appointment
	job_description: String,
	created_at: {type:Date, 'default': Date.now}
});

var Vacancies = mongoose.model('vacancies',vacanciesSchema);

var vacancySkillsSchema = new mongoose.Schema({
	id: {type: String, unique:true, 'default':shortid.generate},
	vacancy_id: String,
	skill: String,
	created_at: {type:Date, 'default': Date.now}
});

var Skills = mongoose.model('vacancy_skills',vacancySkillsSchema);

var vacancyCertifatesSchema = new mongoose.Schema({
	id: {type:String, unique:true, 'default':shortid.generate},
	vacancy_id: String,
	certificate: String,
	created_at: {type:Date, 'default': Date.now}
});

var Certicates = mongoose.model('vacancy_certificates',vacancyCertifatesSchema);

//applications
var vacancyApplicationSchema = new mongoose.Schema({
	id: {type:String,unique:true,'default':shortid.generate},
	vacancy_id: String,
	user_id: String,
	created_at: {type:Date, 'default': Date.now}
});

var Applications = mongoose.model('vacancy_applications',vacancyApplicationSchema);

var exports = module.exports;

exports.create_vacancy = function(requestBody,response){
	response.data = {};//define client response array

	Vacancies.find({$and: [{startup_id: requestBody.startup_id},{position: requestBody.startup_id},{type:requestBody.type}]},function(error,data){
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Vacancy has priorly been declared";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Vacancy = toVacancies(requestBody);
				Vacancy.save(function(error){
					if (error) {
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Vacancy created";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}
		}
	});
} 

exports.create_vacancy_skills = function(requestBody,response){

	response.data = {};//define client response array

	Skills.find({$and: [{vacancy_id:requestBody.vacancy_id},{skill:requestBody.skill}]},function(error,data){
		if(error){
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Skill already declared";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Skill = toSkills(requestBody);

				Skill.save(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Skill saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				})
			}
		}
	});
}

exports.create_vacancy_certificate = function(requestBody,response){
	response.data = {};//define client response array

	Certicates.find({$and: [{vacancy_id:requestBody.vacancy_id},{certificate:requestBody.certificate}]},function(error,data){
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Certicate = toCertificates(requestBody)

				Certicate.save(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Certicate saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}
		}
	});
}

exports.create_vacancy_application = function(requestBody,response){

	response.data = {};
	Applications.find({$and: [{vacancy_id:requestBody.vacancy_id},{user_id:requestBody.user_id}]},function(error,data){
		if (error) {
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(response.data);
			}
		}else{
			if (data) {
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Application has priorly been submitted";
				response.data.success = 0;
				response.end(response.data);
			}else{
				var Application = toApplication(requestBody);
				Application.save(function(error){
					if (error) {
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(response.data);
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Application sent";
						response.data.success = 1;
						response.end(response.data);
					}
				})
			}
		}
	})
}

exports.delete_vacancy = function(requestBody,response){

	response.data = {};

	Vacancies.find({id: requestBody.vacancy_id},function(error,data){
		if (error) {
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if (data) {
				data.remove(function(error){
					if(error){
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}						
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Vacancy removed";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Data non-existent";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_vacancy_skill = function(requestBody,response){
	response.data = {};
	Skills.find({id: requestBody.skill_id},function(error,data){
		if (error) {
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if (data) {
				data.remove(function(error){
					if(error){
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}						
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Skill removed";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Data non-existent";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}		
	});
}

exports.delete_vacancy_certificate = function(requestBody,response){
	response.data = {};
	Certicates.find({id: requestBody.certificate_id},function(error,data){
		if (error) {
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if (data) {
				data.remove(function(error){
					if(error){
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}						
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Certicate removed";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Data non-existent";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_vacancy_application = function(requestBody,response){
	response.data = {};
	Applications.find({id: requestBody.application_id},function(error,data){
		if (error) {
			if (response==null) {
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if (data) {
				data.remove(function(error){
					if(error){
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}						
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Application removed";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Data non-existent";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

function toVacancies(data){
	return new Vacancies({
		startup_id: data.startup_id,
		position: data.position,
		type: data.type,
		job_description: data.job_description		
	});
}

function toSkills(data){
	return new Skills({
		vacancy_id: data.vacancy_id,
		skill: data.skill,
	});
}

function toCertificates(data){
	return new Certicates({
		vacancy_id: data.vacancy_id,
		certificate: data.certificate,
	});
}

function toApplication(data){
	return new Applications({
		vacancy_id: data.vacancy_id,
		user_id: data.user_id
	});
}