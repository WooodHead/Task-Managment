var React = require('react');
var Auth =require('./modules/Auth1');


var TaskForm = require('./TaskForm.js');

module.exports=Tasks = React.createClass({

		getInitialState: function(props){
			props = props || this.props;
			return {tasks:props.route.tasks};
		},
		componentWillReceiveProps: function(newProps, oldProps){
			this.setState(this.getInitialState(newProps));
		},
		
		AddTask: function(task){
		
			var request = new XMLHttpRequest(), self = this;
			request.open("POST", "/api/addTask", true);
			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
			request.onreadystatechange = function() {//Call a function when the state changes.
			if(request.readyState == 4 && request.status == 200) {
			var updated =[];
			if(self.state.tasks)
			 	updated=self.state.tasks;
      // Push them onto the end of the current tweets array
			if(request.responseText){
				updated.push(JSON.parse(request.responseText));
			}
			self.setState({tasks: updated});
			}
			}
		request.send(JSON.stringify({task:task}));
		},


     render:function(){
		return(
        <div className="row">
            <div className="medium-8 columns">
                <h5>Tasks</h5>
                <TaskList tasks={this.state.tasks }></TaskList>
            </div>
            <div className="medium-4 columns">
                <h5 id="form-header">Add  Task</h5>
                <TaskForm onSubmitTask={this.AddTask}></TaskForm>
            </div>
        </div>
		)
	}
 
});
TaskList = React.createClass({
    render: function(){
       var tasks =[];
	   if(this.props.tasks){
		   tasks=this.props.tasks.map (function(task) {
				return (
				<TaskObj key={ task._id } task={ task }></TaskObj>
				)
			});
	   }

        return  (
			<table className="DirectoryList">
                    <thead>
                        <tr>
                            
                            <th>task_Name</th>
                            <th>Description</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        { tasks}
                    </tbody>
                </table>
		)
	}
});

TaskObj = React.createClass({
  
    render: function(){

    return (
        <tr className="DirectoryItem">
            <td className="DirectoryItem__name">{ this.props.task.task_Name }</td>
            <td className="DirectoryItem__position">{ this.props.task.Description }</td>
			<td className="DirectoryItem__position">{ this.props.task.duration}</td>
        </tr>
	)
	}
});

