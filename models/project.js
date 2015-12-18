var mongoose = require('mongoose');
var db = mongoose.connection;

// Project Schema

var ProjectSchema = mongoose.Schema({
	owner: {
		type: String
	},
	projectname:{
		type: String
	},
	todo:{
		type: []
	},
	inprogress:{
		type: []
	},
	done:{
		type: []
	}
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);