
var React = require('react');
var ReactDOM = require('react-dom');
var Router=require('react-router').Router,
 Route=require('react-router').Route,
 Link=require('react-router').Link,
 IndexRoute=require('react-router').IndexRoute,
 hashHistory=require('react-router').hashHistory,
 browserHistory=require('react-router').browserHistory;
var TaskManagmentApp = require('./components/TaskManagmentApp');
var Home = require('./components/Home.js');
var Dashboard = require('./components/Dashboard.js');

var Projects = require('./components/Projects.js');
var Tasks = require('./components/Tasks.js');
var Activties = require('./components/Activties.js');
var LoginPage  = require('./components/container/LoginPage.js');
var Auth  = require('./components/modules/Auth1.js');
var SignupPage  = require('./components/container/SignupPage.js');
var handleLogout  = require('./components/container/handleLogout.js');


// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)
var redir=function(location, callback){
   if(Auth.isUserAuthenticated()) {
      callback(null, Dashboard);
   } else {
      callback(null, Home);}
};

// Render the components, picking up where react left off on the server
ReactDOM.render(( <Router history = {browserHistory}>
      <Route path = "/" component = {TaskManagmentApp}  >
         <IndexRoute getComponent = {redir}/>
         <Route path = "home" component = {Home} />
         <Route path = "dashboard" component = {Dashboard} >
            <Route path = "projects" component={Projects}/>
            <Route path = "activties" component = {Activties} />
            <Route path = "tasks" component = {Tasks} />
        </Route>
         <Route path = "logout" onEnter={handleLogout}/>
         <Route path = "login" component = {LoginPage} />
         <Route path = "signup" component = {SignupPage} />
      </Route>
   </Router>),document.getElementById('react-app')
);