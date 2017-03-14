var React = require('react');
var ReactDOM = require('react-dom');
var Router=require('react-router').Router,
 Route=require('react-router').Route,
 Link=require('react-router').Link,
 IndexRoute=require('react-router').IndexRoute,
 hashHistory=require('react-router').hashHistory,
 browserHistory=require('react-router').browserHistory;
var TaskManagmentApp = require('./client/components/TaskManagmentApp');
var Users = require('./client/components/Users.js');
var Tasks = require('./client/components/Tasks.js');
var Assignment = require('./client/components/Assignment.js');
var LoginPage  = require('./client/components/container/LoginPage.js');
var Auth  = require('./client/components/modules/Auth1.js');
var SignupPage  = require('./client/components/container/SignupPage.js');


var routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      getComponent: function(location, callback) {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, HomePage);
        }
      }
    },

    {
      path: 'login',
      component: LoginPage
    },

    {
      path: 'signup',
      component: SignupPage
    },

    {
      path: 'logout',
      onEnter:function (nextState, replace) {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};
module.exports = routes;