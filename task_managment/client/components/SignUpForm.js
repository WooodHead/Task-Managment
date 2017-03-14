/** @jsx React.DOM */

var React = require('react');
var Link=require('react-router').Link;

module.exports=SignUpForm =React.createClass({

  
	getInitialState: function(props){
		props = props || this.props;
		return {};
  },

  // Render the component
  render: function(){

    return (

//

<form className="form-horizontal" onSubmit={this.props.onSubmitForm}>
 <fieldset>
    <div id="legend">
      <legend >Sign Up</legend>
      </div>
      {this.props.errors.summary1 && <span className="help-block">{this.props.errors.summary1}</span>}
      <div className="form-group error">
        <input className="form-control" type='text' name="name" placeholder="" className="input-xlarge"  onChange={this.props.onChangeInput}/>
           <span className="help-block">{this.props.errors.name}</span>
      </div>
       <div className="form-group error">
        <input className="form-control" type='email' name="email" placeholder="" className="input-xlarge"  onChange={this.props.onChangeInput}/>
        <span className="help-block">{this.props.errors.email}</span>
      </div>
      <div className="form-group error">
        <input className="form-control" type='password' name="password" placeholder="" className="input-xlarge" onChange={this.props.onChangeInput}/>
        <span className="help-block">{this.props.errors.password}</span>
      </div>
      <div className="form-group">
        <input type="submit" value="Create New Account" className="btn btn-success" />
      </div>
      <div className="form-group">
      <div >Already have an account? <Link to="login">Log in</Link>
      </div></div>
       </fieldset>
    </form>
     
    )

  }

});
