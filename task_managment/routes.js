var	JSX = require('node-jsx').install(),
	React = require('react'),
	ReactDOMServer  = require('react-dom/server'),
  TaskManagmentApp = React.createFactory(require('./components/TaskManagmentApp')),
  Task = require('./models/Task'),
  User = require('./models/User');
var express = require('express');
var router = express.Router();

 router.get(['/','/tasks','/users','/assignment',],function(req, res,next) {
    User.getUsers(0,0, function(users) {
		var users=users;
			  
	  Task.getTasks(0,0,function(tasks){
		var tasks=tasks;
		var markup = ReactDOMServer.renderToString(
			TaskManagmentApp({
			users: users,
			tasks: tasks
			})
		);

      // Render our 'home' template
		res.render('home', {
			markup: markup, // Pass rendered react markup
			state: JSON.stringify({users:users,tasks:tasks}) // Pass current state to client side
		});
	  });

    });
  });
 
  router.post('/addUser',function(req, res,next) {
	var user=req.body.user;
    User.addUser(user, function(users) {

      res.send(users);

    });
  });
  router.post('/addTask',function(req, res,next) {
	var task=req.body.task;
    Task.addTask(task, function(tasks) {

      res.send(tasks);

    });
  });
  router.post('/assignTask',function(req, res,next) {
	var assignment=req.body.assignment;
    User.assignTaskToUser(assignment, function(user) {
		res.send(user);
    });
  });


module.exports = router;
