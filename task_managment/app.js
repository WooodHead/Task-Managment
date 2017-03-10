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
var Users = require('./client/components/Users.js');
var Tasks = require('./client/components/Tasks.js');
var Assignment = require('./client/components/Assignment.js');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)

// Render the components, picking up where react left off on the server
ReactDOM.render(( <Router history = {browserHistory}>
      <Route path = "/" component = {TaskManagmentApp} users={initialState.users} tasks={initialState.tasks}>
         <IndexRoute component = {Tasks} tasks={initialState.tasks}/>
         <Route path = "tasks" component = {Tasks} tasks={initialState.tasks}/>
         <Route path = "users" component = {Users} users={initialState.users}/>
         <Route path = "assignment" component = {Assignment} users={initialState.users} tasks={initialState.tasks}/>
      </Route>
   </Router>),document.getElementById('react-app')
);