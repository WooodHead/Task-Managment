
var React = require('react');
var Link=require('react-router').Link;

module.exports=LoginForm =React.createClass({

  
	getInitialState: function(props){
		props = props || this.props;
		return {
		users:{
            name:'',
            email:'',
            password:''

          }
		};
	},

  // Render the component
  render: function(){

    return (

<form className="form-horizontal" onSubmit={this.props.onSubmitForm}>
    <fieldset>
     <div id="legend">
     <legend >Login</legend>
     </div>
      {this.props.successMessage && <span className="help-block">{this.props.successMessage}</span>}
      {this.props.errors.summary1 && <span className="help-block">{this.props.errors.summary1}</span>}
      <div className="form-group error">
        <input  className="form-control" type='email' name="email" placeholder="Email" className="input-xlarge" onChange={this.props.onChangeInput}/>
        <span className="help-block">{this.props.errors.email}</span>
      </div>
       <div className="form-group error">
          <input  className="form-control" type='password' name="password" placeholder="password" className="input-xlarge" onChange={this.props.onChangeInput}/>
         <span className="help-block">{this.props.errors.password}</span>
      </div>
       <div className="form-group">
      <div >
        <input type="submit" value="Log in" className="btn btn-success" />
      </div></div>
       <div className="form-group">
      <div >Dont have an account? <Link to="signup">Create one </Link> 
      </div> </div>
      </fieldset>
    </form>
    )

  }

});
