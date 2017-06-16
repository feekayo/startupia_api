var mongoose = require('mongoose'),
	shortid = require('shortid'),
	Users = require('./users');

var certificatesSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	name: String,
	field: String,
	institiution: String,
	year: String,
	link: String,
	created_at: {type:Date, 'default': Date.now}
});

var Certificates = mongoose.model('certificates',certificatesSchema);

var jobsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	company_name: String,
	position: String,
	job_description: String,
	start_year: String,
	end_year: String,
	created_at: {type:Date, 'default': Date.now}
});

var Jobs = mongoose.model('jobs',jobsSchema);

var projectsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	title: String,
	url: String,
	release_date: String,
	version: String,
	role: String,
	project_description: String,
	created_at: {type:Date, 'default': Date.now}
});

var Projects = mongoose.model('projects',projectsSchema);

var skillsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	skill_id: String,
	url: String,
	created_at: {type:Date, 'default': Date.now}
});

var Skills = mongoose.model('skills',skillsSchema)

var expertSkillsSchema = new mongoose.Schema({
	id: {type: String, unique: true},
	skill_name: String
});

var ExpertSkills = mongoose.model('expert_skills',expertSkillsSchema);

var toolsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	skill_id: String,
	tool: String,
	created_at: {type:Date, 'default': Date.now}
});

var Tools = mongoose.model('tools',toolsSchema);

var interestsSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	name: String,
	url: String,
	created_at: {type:Date, 'default': Date.now}
});

var Interests = mongoose.model('interests',interestsSchema);

var essaySchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	essay: String,
	created_at: {type:Date, 'default': Date.now}
});

var Essay = mongoose.model('essay',essaySchema);

var socialSchema = new mongoose.Schema({
	id: {type: String, unique: true, 'default': shortid.generate},
	user_id: String,
	platform: String,
	url: String,
	created_at: {type:Date, 'default': Date.now}
});

var Social = mongoose.model('socials',socialSchema);

var exports = module.exports;

exports.create_certificate = function(requestBody,response){
	response.data = {};
	//check if certificate exists
	Certificates.find({$and:[{user_id:requestBody.user_id},{name: requestBody.name},{institiution: requestBody.institiution},{year: requestBody.year}]},function(error,data){
		if(error){//if error exists
			if(response==null){//check for error 500
				response.writeHead(500,{'Content-Type':'application/json'});//define response type
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));//send response
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				console.log(data);
				response.writeHead(200,{'Content-Type':'application/json'})//define response type
				response.data.log = "Certificate exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));//send response
			}else{
				var Certificate = toCertificate(requestBody);

				Certificate.save(function(error){
					if(error){
						if(response==null){//check for error 500
							response.writeHead(500,{'Content-Type':'application/json'});//define response taye
							response.data.log ="Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));//send response
						}	
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});//define response type
						response.data.log = "Certificate saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));//send response
					}
				});
			}
		}
	});

}
exports.create_job = function(requestBody,response){
	response.data = {};
	Jobs.find({$and: [{user_id: requestBody.user_id},{company_name:requestBody.company_name},{position: requestBody.position},{start_year: requestBody.start_year},{end_year:requestBody.end_year}]},function(error,data){
		if(error){//check for errors
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Job exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Job = toJob(requestBody);

				Job.save(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Job saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});				
			}
		}
	});
}
exports.create_project = function(requestBody,response){
	response.data = {};
	Projects.find({$and: [{user_id:requestBody.user_id},{title:requestBody.title},{version:requestBody.version}]},function(error,data){
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Project exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Project = toProjects(requestBody);
				console.log(requestBody.project_description);
				Project.save(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Project saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});
			}
		}
	});
}

exports.create_skill = function(requestBody,response){
	
	response.data = {};	

	ExpertSkills.findOne({skill_name: requestBody.name},function(error,data){
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));				
			}
		}else{
			if(data){
				skill_id = data.id;

				Skills.find({$and: [{user_id: requestBody.user_id},{skill_id:skill_id}]},function(error,data){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));				
						}
					}else{
						if(data && (Object.keys(data).length!=0)){
							response.writeHead(200,{'Content-Type':'application/json'});
							response.data.log = "Skill Priorly saved";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}else{
							var Skill = toSkills(requestBody,skill_id);
							Skill.save(function(error){
								if (error) {
									if (response==null) {
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
							});								
						}
					}
				});

			}else{
				var skill_id = shortid.generate();
				var ExpertSkill = toExpertSkills(requestBody.name,skill_id);

				ExpertSkill.save(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));				
						}						
					}else{
						Skills.find({$and: [{user_id: requestBody.user_id},{skill_id:skill_id}]},function(error,data){
							if(error){
								if(response==null){
									response.writeHead(500,{'Content-Type':'application/json'});
									response.data.log = "Internal server error";
									response.data.success = 0;
									response.end(JSON.stringify(response.data));				
								}
							}else{
								if(data && (Object.keys(data).length!=0)){
									response.writeHead(200,{'Content-Type':'application/json'});
									response.data.log = "Skill Priorly saved";
									response.data.success = 0;
									response.end(JSON.stringify(response.data));
								}else{
									var Skill = toSkills(requestBody,skill_id);
									Skill.save(function(error){
										if (error) {
											if (response==null) {
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
									});								
								}
							}
						});
					}
				})
			}
		}
	});	
}

exports.create_tool = function(requestBody,response){
	response.data = {};
	Tools.find({$and: [{user_id: requestBody.user_id},{tool: requestBody.tool}]},function(error,data){
		if (error) {
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Tool exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Tool = toTools(requestBody);

				Tool.save(function(error){
					if (error) {
						if (response==null) {
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
				});	
			}
		}
	});
}

exports.create_interest = function(requestBody,response){
	response.data = {};
	Interests.find({$and: [{user_id: requestBody.user_id},{name: requestBody.name}]},function(error,data){
		if (error) {
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Interest exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Interest = toInterests(requestBody);

				Interest.save(function(error){
					if (error) {
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Interest saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});	
			}
		}
	});
}

exports.create_essay = function(requestBody,response){
	response.data = {};
	Essay.find({user_id: requestBody.user_id},function(error,data){
		if (error) {
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Essay exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Essay1 = toEssay(requestBody);

				Essay1.save(function(error){
					if (error) {
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Essay saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});	
			}
		}
	});
}

exports.create_social = function(requestBody,response){
	response.data = {};
	Essay.find({$and: [{user_id: requestBody.user_id},{platform:requestBody.platform}]},function(error,data){
		if (error) {
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Platform exists";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}else{
				var Social1 = toSocial(requestBody);

				Social1.save(function(error){
					if (error) {
						if (response==null) {
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Social saved";
						response.data.success = 1;
						response.end(JSON.stringify(response.data));
					}
				});	
			}
		}
	});
	
}


exports.fetch_cv = function(requestBody,response){
	response.data = {};//response array

	var pipeline = [{
		$match: {id: requestBody.user_id}
	},{
		$lookup: {
			from: "certificates",
			localField: "id",
			foreignField: "user_id",
			as: "certificates" 
		}
	},{
		$lookup: {
			from: "jobs",
			localField: "id",
			foreignField: "user_id",
			as: "jobs"
		}
	},{
		$lookup: {
			from: "projects",
			localField: "id",
			foreignField: "user_id",
			as: "projects"
		}
	},{
		$lookup:{
			from: "skills",
			localField: "id",
			foreignField: "user_id",
			as: "skills"
		}
	},{
		$lookup:{
			from: "tools",
			localField: "id",
			foreignField: "user_id",
			as: "tools"
		}
	},{
		$lookup:{
			from: "interests",
			localField: "id",
			foreignField: "user_id",
			as: "interests"
		}
	},{
		$lookup:{
			from: "essay",
			localField: "id",
			foreignField: "user_id",
			as: "essay"
		}
	},{
		$lookup:{
			from: "socials",
			localField: "id",
			foreignField: "user_id",
			as: "socials"
		}
	},{
		$project: {
			"certificates": 1,
			"projects":1,
			"jobs":1,
			"skills":1,
			"tools":1,
			"interests":1,
			"socials":1,
			"essay":1
		}
	}];

	Users.users_model.aggregate(pipeline,function(error,data){
		if(error){
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && Object.keys(data).length!=0){
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Data fetched";
				response.data.success = 1;
				response.data.data = data;
				response.end(JSON.stringify(response.data));				
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "No Data";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.fetch_skills = function(requestBody,response){
	response.data = {};
	Skills.find({user_id:requestBody.user_id},function(error,data){
		if (error) {
			if(response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data && (Object.keys(data).length!=0)){
				console.log(data);
				response.writeHead(201,{'Content-Type':'application/json'});
				response.data.log = "Skills fetched";
				response.data.success = 1;
				response.data.data = data;
				response.end(JSON.stringify(response.data));
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "No saved skills";
				response.data.success = 0;
				response.end(JSON.stringify(response.data))
			}
		}
	})
}

exports.delete_certificate = function(requestBody,response){
	response.data = {};
	Certificates.findOne({$and: [{id:requestBody.cert_id},{user_id:requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Certificate deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Certificate doesn't exist";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_job = function(requestBody,response){
	response.data = {};
	Jobs.findOne({$and: [{id:requestBody.job_id},{user_id:requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Job deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Job doesn't exist";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_project = function(requestBody,response){
	response.data = {};
	Projects.findOne({$and: [{id:requestBody.project_id},{user_id:requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Project deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "User unauthorized";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_skill = function(requestBody,response){
	response.data = {};
	Skills.findOne({$and: [{id:requestBody.skill_id},{user_id:requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Skill deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "User unauthorized";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_tool = function(requestBody,response){
	response.data = {};
	Tools.findOne({$and: [{id:requestBody.tool_id},{user_id:requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Tool deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "User unauthorized";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_interest = function(requestBody,response){
	response.data = {};
	Interests.findOne({$and: [{id:requestBody.interest_id},{user_id:requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Interest deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "User unauthorized";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_essay = function(requestBody,response){
	response.data = {};
	Essay.findOne({user_id:requestBody.user_id},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Essay deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "Essay doesn't exist";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

exports.delete_social = function(requestBody,response){
	response.data = {};
	Social.findOne({$and:[{id:requestBody.social_id},{user_id: requestBody.user_id}]},function(error,data){
		if(error){
			if (response==null){
				response.writeHead(500,{'Content-Type':'application/json'});
				response.data.log = "Internal server error";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}else{
			if(data){
				data.remove(function(error){
					if(error){
						if(response==null){
							response.writeHead(500,{'Content-Type':'application/json'});
							response.data.log = "Internal server error";
							response.data.success = 0;
							response.end(JSON.stringify(response.data));
						}
					}else{
						response.writeHead(201,{'Content-Type':'application/json'});
						response.data.log = "Social platform deleted";
						response.data.success = 1;
						response.end(JSON.stringify(response.data))
					}
				})
			}else{
				response.writeHead(200,{'Content-Type':'application/json'});
				response.data.log = "User unauthorized";
				response.data.success = 0;
				response.end(JSON.stringify(response.data));
			}
		}
	});
}

function toCertificate(data){
	return new Certificates({
		user_id: data.user_id,
		name: data.name,
		field: data.field,
		institiution: data.institiution,
		link: data.link,
		year: data.year
	});
}

function toJob(data){
	return new Jobs({
		user_id: data.user_id,
		company_name: data.company_name,
		position: data.position,
		job_description: data.job_description,
		start_year: data.start_year,
		end_year: data.end_year		
	});	
}

function toProjects(data){
	return new Projects({
		user_id: data.user_id,
		title: data.title,
		url: data.url,
		release_date: data.release_date,
		version: data.version,
		role: data.role,
		project_description: data.project_description		
	});
}

function toSkills(data,skill_id){
	return new Skills({
		user_id: data.user_id,
		skill_id: skill_id,
		url: data.url
	});
}

function toExpertSkills(name,id){
	return new ExpertSkills({
		id: id,
		skill_name: name
	})
}

function toTools(data){
	return new Tools({
		user_id: data.user_id,
		skill_id: data.skill_id,
		tool: data.tool		
	});
}

function toInterests(data){
	return new Interests({
		user_id: data.user_id,
		name: data.name,
		url: data.url
	});
}

function toEssay(data){
	return new Essay({
		user_id: data.user_id,
		essay: data.essay
	});
}

function toSocial(data){
	return new Social({
		user_id: data.user_id,
		platform: data.platform,
		url: data.url
	});
}