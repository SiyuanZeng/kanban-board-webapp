
var express 		= require('express');
var router 			= express.Router();
var mongoose 		= require('mongoose');
var path			= require('path');
var crypto			= require('crypto');

// Models
var User 			= require('../models/users');
var Project 		= require('../models/project');


/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.session.visitcount) {
		req.session.visitcount = 1;
	} else {
		req.session.visitcount++;
	}
  //res.sendFile(path.join(__dirname, '../views/login.html'));
  res.render('login');
});


// LOGIN & LOAD USER'S KANBAN LATEST BOARD
router.post('/user', function(req, res){
	var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
	console.log(hash);

	mongoose.model('User').find({username: req.body.username, password: hash}, function(err, user){
		console.log(user.length);

		// Find a project where owner equals req.body.username
		mongoose.model('Project').find({owner: req.body.username}, function(err, project){
			console.log(project.length);

			if(project.length == 1 && user.length == 1) {
				res.render('main', {
			 	loggedin: req.body.username,
			 	projectname: project[0].projectname,
			 	todo: JSON.parse(project[0].todo),
			 	inprogress: JSON.parse(project[0].inprogress),
			 	done: JSON.parse(project[0].done)
			 });

			// Start a new project
			} else if(user.length == 1 && project.length != 1){
				res.render('main', {
				loggedin: req.body.username,
				projectname: 'New Agile Project',
				todo: [],
				inprogress: [],
				done: []
			});

			} else {
				res.redirect('/');
			}

		});
	});
});

// LOAD REGISTER PAGE
router.get('/register', function(req, res, next) {
//res.sendFile(path.join(__dirname, '../views/register.html'));
	res.render('register');
});

// ADD NEW USER
router.post('/adduser', function(req, res, next){
	mongoose.model('User').find({username: req.body.username}, function(err, user){
		
		// No user exists with same username.
		if(user.length == 0) {

			var newUser = new User();
			newUser.username = req.body.username;
			newUser.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
			newUser.email 	 = req.body.email;

			newUser.save(function(err){
				if(err) throw err;
			});

			res.redirect('/');
		
		} else {
			res.send("<script>alert('Username already taken. Choose another.');window.location.href = '/register';</script>");
		}
	});
});

// SAVE KANBAN BOARD
router.post('/saveproject', function(req, res, next){
	
	var projectname 	= req.body.projectname;
	var projectowner 	= req.body.owner;
	var todolist 		= req.body.todolist;
	var inproglist 		= req.body.inprogresslist;
	var donelist 		= req.body.donelist;
	
	console.log(todolist);

	mongoose.model('Project').find({owner: projectowner}, function(err, project){
		
		if(project.length == 0) {
			
			// use save method
			var newProject = new Project();
			newProject.owner = projectowner;
			newProject.projectname = projectname;
			newProject.todo = todolist;
			newProject.inprogress = inproglist;
			newProject.done = donelist;

			newProject.save(function(err){
				if(err) throw err;
			});
			
		} else {

			project[0].projectname = projectname;
			project[0].todo = todolist;
			project[0].inprogress = inproglist;
			project[0].done = donelist;
			project[0].save(function(err){
				if(err) throw err;
			});
		}
	});

	res.redirect('/');
});

module.exports = router;
