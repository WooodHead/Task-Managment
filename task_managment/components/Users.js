var React = require('react');

var UserForm = require('./UserForm.js');

module.exports=Users = React.createClass({

     getInitialState: function(props){
		 props = props || this.props;
        return {users:props.route.users};
	},
	componentWillReceiveProps: function(newProps, oldProps){
		this.setState(this.getInitialState(newProps));
	},
    AddEntry: function(user){
		
		 var request = new XMLHttpRequest(), self = this;
		 request.open("POST", "/addUser", true);
		 request.setRequestHeader("Content-type", "application/json");
		 request.onreadystatechange = function() {//Call a function when the state changes.
    if(request.readyState == 4 && request.status == 200) {
			var updated = self.state.users;
      // Push them onto the end of the current tweets array
	  if(request.responseText){
			updated.push(JSON.parse(request.responseText));
	  }
		self.setState({users: updated});
		}
	}
      request.send(JSON.stringify({user:user}));
	},

    render:function(){
		return(
        <div className="row">
            <div className="medium-8 columns">
                <h5>Users</h5>
                <UserList users={this.state.users }></UserList>
            </div>
            <div className="medium-4 columns">
                <h5 id="form-header">Add  User</h5>
                <UserForm onSubmitUser={this.AddEntry}></UserForm>
            </div>
        </div>
		)
	}

});
UserList = React.createClass({
    render: function(){
      var users =[];
	   if(this.props.users){ 
		users =this.props.users.map (function(user) {
            return (
			<UserObj key={ user._id } user={ user }></UserObj>
			)
	   });
	   }

        return  (
			<table className="DirectoryList">
                    <thead>
                        <tr>
                            
                            <th>Name</th>
                            <th>Position</th>
                            <th>Email</th>
							<th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users}
                    </tbody>
                </table>
		)
	}
});

UserObj = React.createClass({
  
    render: function(){

    return (
        <tr className="DirectoryItem">
            <td className="DirectoryItem__name">{ this.props.user.name }</td>
            <td className="DirectoryItem__position">{ this.props.user.designation }</td>
            <td className="DirectoryItem__email">{ this.props.user.email }</td>
			<td className="DirectoryItem__position">{ this.props.user.phoneNo}</td>
        </tr>
	)
	}
});


