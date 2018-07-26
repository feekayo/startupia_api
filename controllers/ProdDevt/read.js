//create controller deals with everything to do with creating product development tasks and activities

let Sessions = require('../../models/sessions'),
	Users = require('../../models/users'),
	Privileges = require('../../models/privileges'),
	Startups = require('../../models/startups'),
    Personnel = require('../../models/personnel'),
    Projects = require('../../models/projectManagement/projects'),
    Teams = require('../../models/projectManagement/teams'),
    TeamMembers = require('../../models/projectManagement/teammembers'),
    TeamMessages = require('../../models/projectManagement/teammessages'),
    Tasks = require('../../models/projectManagement/tasks');
    url = require('url');

module.exports = {

	fetch_compartment_team: function(request,response){//fetch all the staffers of a compartment team
		var get_params = url.parse(request.url,true);

		if(get_params.query.user_id!="" && get_params.query.startup_id!="" && get_params.query.department_code!="" && get_params.query.user_id!=undefined && get_params.query.startup_id!=undefined && get_params.query.department_code!=undefined){
			Teams.fetch_compartment_team_id(get_params.query.startup_id,get_params.query.department_code,function(team_id){
				if(team_id){
					TeamMembers.fetch_team_members(team_id,function(team_members){
						if(team_members){
				            response.data = {};
				            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
				            response.data.log = "Team Fetched"; //log message for client
				            response.data.data = team_members;
				            response.data.success = 1;//success variable for client
				            response.end(JSON.stringify(response.data));//send response to client							
						}
					})
				}else{
		            response.data = {};
		            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
		            response.data.log = "Team not found"; //log message for client
		            response.data.success = 0;//success variable for client
		            response.end(JSON.stringify(response.data));//send response to client 					
				}
			})
		}else{
            response.data = {};
            response.writeHead(201,{'Content-Type':'application/json'});//server response set to json format
            response.data.log = "Incomplete data"; //log message for client
            response.data.success = 0;//success variable for client
            response.end(JSON.stringify(response.data));//send response to client 			
		}
	}

}    