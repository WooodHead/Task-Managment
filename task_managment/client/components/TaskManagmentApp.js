/** @jsx React.DOM */

var React = require('react');
var Auth =require('./modules/Auth1');
var Link=require('react-router').Link;

module.exports=TaskManagmentApp =React.createClass({

  
	getInitialState: function(props){
		props = props || this.props;
		return {
	
		};
	},
	componentWillReceiveProps:function(newProps, oldProps){
		this.setState(newProps);
	},
  componentDidMount: function() {
  },
  // Render the component
  render: function(){

    return (
   <div>
	<nav className="navbar navbar-inverse">
  		<div className="container-fluid">
    		<div className="navbar-header">
     		<a className="navbar-brand" href="#">TaskManagment</a>
    		</div>
      	{Auth.isUserAuthenticated() ? (<ul className="nav navbar-nav">
          <li className="active"><Link to="dashboard">Dashboard</Link></li></ul>):(<ul className="nav navbar-nav">
        <li className="active"><Link to="home">Home</Link></li>
        </ul>)}
           {Auth.isUserAuthenticated() ? (<ul className="nav navbar-nav navbar-right">
              <li><Link to="logout"><span className="glyphicon glyphicon-log-out"></span>Log Out</Link></li>
            </ul>):(<ul className="nav navbar-nav navbar-right">
            <li><Link to="signup"><span className="glyphicon glyphicon-user"></span>Sign Up</Link></li>
      			<li><Link to="login"><span className="glyphicon glyphicon-log-in"></span>Login</Link></li></ul>)}
    		
  		</div>
	</nav>

  {this.props.children}</div>
     
    )

  }

});
