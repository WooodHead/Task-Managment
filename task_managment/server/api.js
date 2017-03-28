var express = require('express'),
appEmail = require('./utils/gmail1Config');
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
var upload =  require('./utils/fileUpload');
// var gmailConfig =  require('./utils/gmail1Config');

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
    			task.user_id=user.name;
        		Task.addTask(task, function(tasks) {

          			res.send(tasks);
        		});
        	}else{
        		res.send({error:'cannot find logged user'});
        	}
        });
    }else{
      var id=(' ' + task._id).slice(1);
      var updatedTask={description:task.description,status:task.status,estimation:task.estimation,updated_at:task.updated_at};
      Task.editTask(id,updatedTask, function(task) {
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
				var queryParams={user_id:user.name,project_id:req.query.projectid};
    			Task.getTasksByQuery(queryParams, function(result) {
     		 		res.send(result);
    			});
    		}else
    		  res.send({error:'cannot find logged user'});
    });
  });
  router.get('/getTasksByUser',function(req, res,next) {
    User.getUserByEmail(req.session.email,function(user){
      if(user.name){
        var queryParams={user_id:user.name};
          Task.getTasksByQuery(queryParams, function(result) {
            res.send(result);
          });
        }else
          res.send({error:'cannot find logged user'});
    });
  });
  router.post('/assignTask',function(req, res,next) {
	var assignment=req.body.assignment;
    User.getUserByEmail(assignment.email,function(user){
    if(user.name){
          var updatedTask={user_id:user.name};
          Task.editTask(assignment.task_id,updatedTask, function(task) {
                if(task){
                    appEmail.mailer.send('email', {
                            to: assignment.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                            subject: 'Task Invitation '+assignment.subject, // REQUIRED.
                            otherProperty:{ 'default':'A new task assign to you','Name':task.name,'details':task.description+' '+assignment.details} // All additional properties are also passed to the template as local variables.
                          }, function (err) {
                            if (err) {
                              // handle error
                              console.log(err);
                              res.send('There was an error sending the email');
                              return;
                            }
                              res.send(JSON.stringify({task:task}));
                          });
                }
          });
      }else{
            res.send(JSON.stringify({error:"No User with this email exists.."}));
      }
    });
    
  });
  router.delete('/deleteTasks',function(req, res,next) {
        Task.deleteTasks(req.body.taskids, function(result) {
            res.send(result);
          });
  });
  /////////// End of Tasks
  /////////// Comments Routes
	router.post('/addComment',upload.single('attachment'),function(req, res,next) {
  		  var comment=JSON.parse(req.body.comment);
        var attachment=req.file;

    		User.getUserByEmail(req.session.email,function(user){
    			if(user._id){
            if(comment.details){
        				  comment.user_id=user.name;
            			Comment.addComment(comment, function(result) {
                      var commentRes=result;
                      if(attachment){
                          attachment.user_id=comment.user_id;
                          attachment.task_id=comment.task_id;
                          Attachment.addAttachment(attachment,function(attachmentRes){
                              res.send({commentRes:commentRes,attachmentRes:attachmentRes});
                          });
                      }else{
              				  res.send({commentRes:commentRes,attachmentRes:''});
                      }
            			});
              }else if(attachment){
                          attachment.user_id=user.name;
                          attachment.task_id=comment.task_id;
                          Attachment.addAttachment(attachment,function(attachmentRes){
                              res.send({commentRes:'',attachmentRes:attachmentRes});
                          });
                  }else{
                      res.send({commentRes:'',attachmentRes:''});
                  }
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
    			Comment.getCommentsByUserId(user.name, function(result) {
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