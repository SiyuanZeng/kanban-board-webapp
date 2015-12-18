var mongoose = require('mongoose');
var db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password:{
		type: String
	},
	email:{
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
