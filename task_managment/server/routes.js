var	JSX = require('node-jsx').install(),
	React = require('react'),
	ReactDOMServer  = require('react-dom/server'),
  	TaskManagmentApp = React.createFactory(require('../client/components/TaskManagmentApp')),
  	Task = require('./models/Task'),
  	User = require('./models/User');
var express = require('express');
var mongoose = require('mongoose');
var nev = require('./passport/emailConfig');
var router = express.Router();
 router.get('/',function(req, res,next) {
		var markup = ReactDOMServer.renderToString(
			TaskManagmentApp({
			users: '',
			tasks: ''
			})
		);

      // Render our 'home' template
		res.render('home', {
			markup: markup, // Pass rendered react markup
			state: JSON.stringify({users:'',tasks:''}) // Pass current state to client side
		});

  });


 router.get('/email-verification/:URL', function(req, res) {
  var url = req.params.URL;

  nev.confirmTempUser(url, function(err, user) {
    if (user) {
      nev.sendConfirmationEmail(user.email, function(err, info) {
        if (err) {
          return res.status(404).send('ERROR: sending confirmation email FAILED');
        }
        res.json({
          msg: 'CONFIRMED!',
          info: info
        });
      });
    } else {
      return res.status(404).send('ERROR: confirming temp user FAILED');
    }
  });
});
 router.get('/logout', function(req, res,next) {
  req.session.destroy(function(err) {
  if(err) {
    console.log(err);
     return res.status(404).send(err);
  } else {
   return res.json({
      success: true,
      message: 'You have successfully logout!'
    });
  }
});
  
});

module.exports = router;
