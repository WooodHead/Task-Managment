var React=require('react');
var Router=require('react-router').Router,
 Route=require('react-router').Route,
 Link=require('react-router').Link,
 IndexRoute=require('react-router').IndexRoute,
 hashHistory=require('react-router').hashHistory,
 browserHistory=require('react-router').browserHistory;
var Auth  = require('./client/components/modules/Auth1.js');


module.exports=Base=React.createClass ({
  render: function(){
  return (<div>
    <div className="top-bar">
      <div className="top-bar-left">
        <IndexLink to="/">React App</IndexLink>
      </div>

      {Auth.isUserAuthenticated() ? (
        <div className="top-bar-right">
          <Link to="logout">Log out</Link>
        </div>
      ) : (
        <div className="top-bar-right">
          <Link to="login">Log in</Link>
          <Link to="signup">Sign up</Link>
        </div>
      )}

    </div>

    { /* child component will be rendered here */ }
    {children}

  </div>)
}
});

