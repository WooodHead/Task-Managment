var React = require('react');
var Auth =require('./modules/Auth1');

module.exports=Assignment = React.createClass({

     getInitialState: function(props){
		 props = props || this.props;
        return {users:props.route.users,
				tasks:props.route.tasks};
	},
	componentWillReceiveProps: function(newProps, oldProps){
		this.setState(this.getInitialState(newProps));
	},
    AddAssignment: function(assignment){
		var request = new XMLHttpRequest(), self = this;
		 request.open("POST", "/api/assignTask", true);
		 request.setRequestHeader("Content-type", "application/json");
		 request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
		 request.onreadystatechange = function() {//Call a function when the state changes.
		if(request.readyState == 4 && request.status == 200) {
			var updated = [];
			if(self.state.users)
				updated =self.state.users;
			var res=JSON.parse(request.responseText);
			if(res){
				updated.forEach(function(user) {
					if (user._id ==res._id) {
						user.Tasks =res.Tasks ;
					}
				});
			}
			self.setState({users: updated,tasks:self.state.tasks});
			}
		}
		request.send(JSON.stringify({assignment:assignment}));
	},

    render:function(){
		return(
        <div className="row">
            <div className="medium-8 columns">
                <h5>All Task Assignment</h5>
                <AssignList users={this.state.users } tasks={this.state.tasks } />
            </div>
            <div className="medium-4 columns">
                <h5 id="form-header">Add  User</h5>
            <AssignTask users={this.state.users} tasks={this.state.tasks} onSubmitAssignment={this.AddAssignment}/>
			</div>
        </div>
		)
	}

});
AssignList = React.createClass({
    render: function(){
      var assignments =[],assignmentUI=[],self=this;
	   if(this.props.users){ 
			this.props.users.map (function(user) {
				for(index in user.Tasks){
					var tid=user.Tasks[index]
					var temp={};
						var task = self.props.tasks.filter(function( task ) {
							return task._id == tid;
						});
						if(task[0]){
							temp.user=user;
							temp.task=task[0];
							assignments.push(temp);
						}
				}	
			});
	   }
	   if(assignments){
			assignmentUI=assignments.map(function(obj) {
				return (
					<AssignObj key={ obj.user._id+obj.task._id } user={ obj.user } task={obj.task}></AssignObj>
				)
			});
		}
        return  (
			<table className="DirectoryList">
                <thead>
					<tr>
                        <th>Name</th>
						<th>Task Name</th>
                         <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    { assignmentUI}
                </tbody>
             </table>
		)
	}
});

AssignObj = React.createClass({
  
    render: function(){

    return (
        <tr className="DirectoryItem">
            <td className="DirectoryItem__name">{ this.props.user.name }</td>
			<td className="DirectoryItem__position">{ this.props.task.task_Name }</td>
            <td className="DirectoryItem__email">{ this.props.user.email }</td>
        </tr>
	)
	}
});

AssignTask = React.createClass({

		getInitialState: function(props){
		props=props||this.props;
			return {
				task_id:'',
				user_id:''
			};
		},
   _assignTask:function(e)  {
		e.preventDefault();
        data ={
            task_id: this.refs.task_id.value,
            user_id: this.refs.user_id.value,
			};
       if (data.task_id && data.user_id){
             this.props.onSubmitAssignment(data);
		}
	},
    render: function(){
		var users =[];
	   if(this.props.users){ 
		users =this.props.users.map (function(user) {
            return (
			<OptionObj key={ user._id } value={ user._id } name={ user.name }></OptionObj>
			)
	   });
	   }
	   var tasks =[];
	   if(this.props.tasks){ 
		tasks =this.props.tasks.map (function(task) {
            return (
			<OptionObj key={ task._id } value={ task._id } name={ task.task_Name }></OptionObj>
			)
	   });
	   }
		return(
			<div>
				<form onSubmit={this._assignTask}>
					<label> Select Task
						<select ref="task_id">
							{tasks}
						</select>
					</label>
					<label> Select User
						<select ref="user_id">
							{users}
						</select>
					</label>
					<input type="submit" value="Assign Task" className="small button"/>
				</form>
			</div>
		)
	}

});
OptionObj = React.createClass({
  
    render: function(){

    return (
       <option value={this.props.value}>
            {this.props.name}</option>
           
	)
	}
});