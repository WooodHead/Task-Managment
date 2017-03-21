var express = require('express');
var	JSX = require('node-jsx').install(),
	React = require('react'),
	ReactDOMServer  = require('react-dom/server'),
  	TaskManagmentApp = React.createFactory(require('../client/components/TaskManagmentApp')),
	Task = require('./models/Task'),
	Project = require('./models/Project'),
	Comment = require('./models/Comment'),
	Attachment = require('./models/Attachment'),
  	User = require('./models/User');
var router = new express.Router();
var multer = require('multer');

 /////////// handle Tasks routes
router.get('/tasks',function(req, res,next) {
	  Task.getTasksByProjectsAndUser(0,function(tasks){
		var tasks=tasks;
		var markup = ReactDOMServer.renderToString(
			TaskManagmentApp({
			users: '',
			tasks: tasks
			})
		);

      // Render our 'home' template
		res.render('home', {
			markup: markup, // Pass rendered react markup
			state: JSON.stringify({users:'',tasks:tasks}) // Pass current state to client side
		});
	  });
  });

  router.post('/addTask',function(req, res,next) {
  	var task=req.body.task;
    if(!task._id){
    	User.getUserByEmail(req.session.email,function(user){
    		if(user._id){
    			task.user_id=user._id;
        		Task.addTask(task, function(tasks) {

          			res.send(tasks);
        		});
        	}else{
        		res.send({error:'cannot find logged user'});
        	}
        });
    }else{
      var id=(' ' + task._id).slice(1);
      Task.editTask(id,task, function(task) {
           res.send(task);
      });
    }
  });
  router.get('/getTasksByProject',function(req, res,next) {
      var queryParams={project_id:req.query.projectid};
    	Task.getTasksByQuery(queryParams, function(result) {
     		 res.send(result);
    	});
  });
  router.get('/getTasksByProjectUser',function(req, res,next) {
		User.getUserByEmail(req.session.email,function(user){
			if(user._id){
				var queryParams={user_id:user._id,project_id:req.query.projectid};
    			Task.getTasksByQuery(queryParams, function(result) {
     		 		res.send(result);
    			});
    		}else
    		  res.send({error:'cannot find logged user'});
    });
  });
  router.get('/getTasksByUser',function(req, res,next) {
    User.getUserByEmail(req.session.email,function(user){
      if(user._id){
        var queryParams={user_id:user._id};
          Task.getTasksByQuery(queryParams, function(result) {
            res.send(result);
          });
        }else
          res.send({error:'cannot find logged user'});
    });
  });
  router.post('/assignTask',function(req, res,next) {
	var assignment=req.body.assignment;
    User.assignTaskToUser(assignment, function(user) {
		res.send(user);
    });
  });
  router.delete('/deleteTasks',function(req, res,next) {
        Task.deleteTasks(req.body.taskids, function(result) {
            res.send(result);
          });
  });
  /////////// End of Tasks
  /////////// Comments Routes
	router.post('/addComment',multer({ dest: './uploads/'}).single('attachment'),function(req, res,next) {
  		  var comment=req.body.comment;
        var file=req.files;
    		User.getUserByEmail(req.session.email,function(user){
    			if(user._id){
    				comment.user_id=user._id;
        			Comment.addComment(comment, function(result) {
          				res.send(result);
        			});
        		}else{
        			res.send({error:'cannot find logged user'});
        		}
       		 });
  });
	router.get('/getCommentByTask',function(req, res,next) {
  		var taskid=req.query.taskid;
    	Comment.getCommentsByTaskId(taskid, function(result) {
     		 res.send(result);
    	});
  });
	router.get('/getCommentByUser',function(req, res,next) {
		User.getUserByEmail(req.session.email,function(user){
			if(user._id){
    			Comment.getCommentsByUserId(user._id, function(result) {
     		 		res.send(result);
    			});
    		}else
    		  res.send({error:'cannot find logged user'});
    });
  });
  //////////  End Comments
  /////////// handle Projects routes
	router.post('/addProject',function(req, res,next) {
		var project=req.body.project;
    if(!project._id){
  		User.getUserByEmail(req.session.email,function(user){
  			project.users=[];
  			if(user._id){
          delete project._id;
  				project.users.push(user._id);
      			Project.addProject(project, function(result) {
       		 		res.send(result);
      			});
      		}else
      		  res.send({error:'cannot find logged user'});
      });
    }else{
      var id=(' ' + project._id).slice(1);
      Project.editProject(id,project, function(project) {
           res.send(project);
      });
    }
  });
	router.get('/getProjectByUser',function(req, res,next) {
		User.getUserByEmail(req.session.email,function(user){
			if(user._id){
    			Project.getProjects(user._id, function(result) {
     		 		res.send(result);
    			});
    		}else
    		  res.send({error:'cannot find logged user'});
    });
  });
  router.get('/getProjectName',function(req, res,next) {
    User.getUserByEmail(req.session.email,function(user){
      if(user._id){
          Project.getProjectsName(user._id, function(result) {
            res.send(result);
          });
        }else
          res.send({error:'cannot find logged user'});
    });
  });
  router.delete('/deleteProjects',function(req, res,next) {
        Project.deleteProjects(req.body.projectids, function(result) {
            res.send(result);
          });
  });
/////////////////// End of Projects Routes
module.exports = router;