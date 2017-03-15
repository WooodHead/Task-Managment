/** @jsx React.DOM */

var React = require('react');
var	ReactDOM = require('react-dom');
var Router=require('react-router').Router,
 Route=require('react-router').Route,
 Link=require('react-router').Link,
 IndexRoute=require('react-router').IndexRoute,
 hashHistory=require('react-router').hashHistory,
 browserHistory=require('react-router').browserHistory;
var TaskManagmentApp = require('./client/components/TaskManagmentApp');
var Home = require('./client/components/Home.js');
var Projects = require('./client/components/Projects.js');
var Tasks = require('./client/components/Tasks.js');
var Activties = require('./client/components/Activties.js');
var LoginPage  = require('./client/components/container/LoginPage.js');
var Auth  = require('./client/components/modules/Auth1.js');
var SignupPage  = require('./client/components/container/SignupPage.js');
var handleLogout  = require('./client/components/container/handleLogout.js');


// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)
var redir=function(location, callback){
   if(Auth.isUserAuthenticated()) {
      callback(null, Projects);
   } else {
      callback(null, Home);}
};

// Render the components, picking up where react left off on the server
ReactDOM.render(( <Router history = {browserHistory}>
      <Route path = "/" component = {TaskManagmentApp}  >
         <IndexRoute getComponent = {redir}/>
         <Route path = "home" component = {Home} />
         <Route path = "projects" component = {Projects} />
         <Route path = "tasks" component = {Tasks} />
         <Route path = "activties" component = {Activties} />
         <Route path = "logout" onEnter={handleLogout}/>
         <Route path = "login" component = {LoginPage} />
         <Route path = "signup" component = {SignupPage} />
      </Route>
   </Router>),document.getElementById('react-app')
);