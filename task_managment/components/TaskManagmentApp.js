/** @jsx React.DOM */

var React = require('react');
//var Users = require('./Users.js');
//var Tasks = require('./Tasks.js');
//var Assignment= require('./Assignment.js');
var Link=require('react-router').Link;

module.exports=TaskManagmentApp =React.createClass({

  
	getInitialState: function(props){
		props = props || this.props;
		return {
		users: props.users,
		tasks:props.tasks
		};
	},
	componentWillReceiveProps:function(newProps, oldProps){
		this.setState(newProps);
	},

  // Render the component
  render: function(){

    return (
      <div className="tasks-app">
		  <ul>
               <li><Link to="tasks">Tasks</Link></li>
				<li><Link to="users">Users</Link></li>
				<li><Link to="assignment">Assignment</Link></li>
            </ul>
           {this.props.children}
      </div>
    )

  }

});
