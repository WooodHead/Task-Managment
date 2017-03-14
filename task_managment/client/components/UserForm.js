var React = require('react')
//Reflux = require('reflux')

//directoryActions = require('../actions/directoryActions.cjsx')
var Users= require('./Users.js');
var UserForm = React.createClass({

		getInitialState: function(props){
		props=props||this.props;
			return {
				name:'',
				email:'',
				phoneNo:''
			};
		},
   _submitUser:function(e)  {
		        e.preventDefault();

        data ={
            name: this.refs.name.value,
            email: this.refs.email.value,
			phoneNo:this.refs.phoneNo.value};
       // if (data.name && data.designation){
             this.props.onSubmitUser(data);
			 this.refs.name.value = '';
             this.refs.email.value = '';
			 this.refs.phoneNo.value='';
		//}
	},
    render: function(){
		return(
			<div>
					<form onSubmit={this._submitUser}>
					<input type="text" name="name" placeholder="Name" ref="name"  />
					<input type="email" name="email" placeholder="E-mail" ref="email" />
					<input type="text" name="phoneNo" placeholder="phoneNo" ref="phoneNo" />
					<input type="submit" value="Add User" className="small button" />
					</form>
			</div>
		)
	}

});
module.exports= UserForm;