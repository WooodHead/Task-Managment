var React = require('react')
//Reflux = require('reflux')

//directoryActions = require('../actions/directoryActions.cjsx')
var Users= require('./Users.js');
var UserForm = React.createClass({

		getInitialState: function(props){
		props=props||this.props;
			return {
				id1:'',
				name:'',
				designation:'',
				email:'',
				phoneNo:'',
				Task_id:''
			};
		},
   _submitUser:function(e)  {
		        e.preventDefault();

        data ={
            id1: this.refs.id1.value?this.refs.id1.value:1,
            name: this.refs.name.value,
            designation: this.refs.designation.value,
            email: this.refs.email.value,
			phoneNo:this.refs.phoneNo.value,
			Task_id:"Task1"};
       // if (data.name && data.designation){
             this.props.onSubmitUser(data);
			 this.refs.id1.value = '';
			 this.refs.name.value = '';
             this.refs.designation.value = '';
             this.refs.email.value = '';
			 this.refs.phoneNo.value='';
		//}
	},
    render: function(){
		return(
			<div>
					<form onSubmit={this._submitUser}>
					<input type="hidden" name="id1" ref="id1" />
					<input type="text" name="name" placeholder="Name" ref="name"  />
					<input type="text" name="designation" placeholder="Designation" ref="designation"  />
					<input type="email" name="email" placeholder="E-mail" ref="email" />
					<input type="text" name="phoneNo" placeholder="phoneNo" ref="phoneNo" />
					<input type="submit" value="Add User" className="small button" />
					</form>
			</div>
		)
	}

});
module.exports= UserForm;