var React = require('react');
var Auth =require('./modules/Auth1');
var ReactDOM = require('react-dom');

module.exports=Tasks = React.createClass({

		getInitialState: function(props){
			props = props || this.props;
			return {
				projectsName:props.projectsName,
				selectedProject:props.selectedProject,
				selectedTasks:[],
				tasks:props.tasks,
				errors:props.errors,
				task:{},
				comment:{}
			};
		},
		componentDidMount: function(){

	        var self=this;
	        const xhr = new XMLHttpRequest();
	        xhr.open('get', '/api/getProjectName');
	        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	        xhr.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
	        xhr.addEventListener('load', function(){
	          if (xhr.status === 200) {
	            var projectsName=JSON.parse(xhr.responseText);
	            self.setState({
	              projectsName: projectsName
	            });
	            if(projectsName&&projectsName[0]){
	            	 self.setState({
	             		 selectedProject: projectsName[0]._id
	            	});
	            	 self.loadTasks(projectsName[0]._id);
	            }
	          } else {
	            // failure

	            // change the component state
	            var errors = xhr.response.errors ? xhr.response.errors : {};
	            errors.summary1 = xhr.response.message;

	           self.setState({
	              errors:errors
	            });
	          }
	        });
	        xhr.send();
	    },
	    onProjectSelectionChange:function(e){
	    	this.setState({selectedProject:e.target.value});
	    	this.loadTasks(e.target.value);
	    },
	    loadTasks:function(projectid){

	        var self=this;
	        console.log(projectid);
	        var params = "projectid="+projectid;
	        const xhr = new XMLHttpRequest();
	        xhr.open('get', '/api/getTasksByProject'+'?'+params,true);
	        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	        xhr.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
	        xhr.addEventListener('load', function(){
	          if (xhr.status === 200) {
	            var tasks=JSON.parse(xhr.responseText);
	            self.setState({
	              tasks: tasks
	            });
	          } else {
	            // failure

	            // change the component state
	            var errors = xhr.response.errors ? xhr.response.errors : {};
	            errors.summary1 = xhr.response.message;

	           self.setState({
	              errors:errors
	            });
	          }
	        });
	        xhr.send();
	    },
	    handleDeletion:function(){
	        var request = new XMLHttpRequest(), self = this;
	            request.open("DELETE", "/api/deleteTasks", true);
	            request.setRequestHeader("Content-type", "application/json");
	            request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
	            request.onreadystatechange = function() {//Call a function when the state changes.
	                if(request.readyState == 4 && request.status == 200) {
	                	 console.log(request);
	                    self.loadTasks(self.state.selectedProject);
	                    self.setState({
	                        selectedTasks:[]
	                    });
	                }
	            }
	            request.send(JSON.stringify({taskids:self.state.selectedTasks}));

	    },
		AddTask: function(e){
		
			e.preventDefault();
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
					if(!self.state.task._id)
						updated.push(JSON.parse(request.responseText));
                    else{
                        updated = updated.filter(function( obj ) {
                            return obj._id !== self.state.task._id;
                        });
						updated.push(JSON.parse(request.responseText));
                    }
				}
				self.setState({tasks: updated,task:{},selectedTasks:[]});
				}
				  $(ReactDOM.findDOMNode(self.refs.taskmodal)).modal('hide');
	            $(ReactDOM.findDOMNode(self.refs.taskmodal)).find("input,textarea,select").val('').end()
	            .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
			}
			if(!self.state.task._id)
				self.state.task.project_id=self.state.selectedProject;
			request.send(JSON.stringify({task:self.state.task}));
		},
		handleHideModal:function(){
	        this.setState({view: {showModal: false}})
	    },
	    handleShowModal:function(){
	    	if(this.state.selectedTasks.length==1){
	            var self=this;
	            var result = this.state.tasks.filter(function( obj ) {
	              return obj._id ==self.state.selectedTasks[0];
	            });
	            this.setState({
	                task:result[0]
	            });
	        }
	        $(ReactDOM.findDOMNode(this.refs.taskmodal)).modal();

	    },
	    closeDialog:function(){
	         $(ReactDOM.findDOMNode(this.refs.taskmodal)).find("input,textarea,select").val('').end()
	                .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
	                this.setState({
	                    task:''
	                });
	     },
	    handleSelection:function(val,flag){
	        if(flag){
	            this.setState({ 
	                selectedTasks: this.state.selectedTasks.concat([val])
	            });
	        }else{
	            var updatedIds=this.state.selectedTasks;
	            var index=updatedIds.indexOf(val);
	            if(index>-1){
	                updatedIds.splice(index,1);
	            }
	            this.setState({ 
	                selectedTasks: updatedIds
	            });
		        }
	    },
	    changeTask:function(event) {
	         const field = event.target.name;
	         const task = this.state.task;
	        task[field] = event.target.value;
	        this.setState({task:task});
	  	},
	  	///////
	  	AddComment:function(e){
			e.preventDefault();
			var request = new XMLHttpRequest(), self = this;
			var file = $("#attachment")[0].files[0];
			var FD = new FormData();
			FD.append("comment", "comment");
			console.log(file);
			FD.append("attachment", file);
			console.log(FD);
			request.open("POST", "/api/addComment", true);
			request.setRequestHeader("Content-type", "multipart/form-data; boundary=---------------------------7da24f2e50046");
			request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
			request.onreadystatechange = function() {//Call a function when the state changes.
				if(request.readyState == 4 && request.status == 200) {
					self.setState({
			 			comment:{}
			 		});
			 		self.hideCModal();
				}
				
			}
			//request.send(JSON.stringify({comment:self.state.comment,myfile:file}));
			request.send(FD);
		},
	 	showCModal:function(e){
	 		e.stopPropagation();
	 		if(e.target.type=='submit'){
	 			console.log($(e.target).parent().siblings().find('input#tid').val());
		 		var taskid=$(e.target).parent().siblings().find('input#tid').val();
		 		this.setState({
		 			comment:{task_id:taskid}
		 		});
		    	$(ReactDOM.findDOMNode(this.refs.cmodal)).modal();
		    }
	    	return false;

		 },
		 hideCModal:function(){
		 	$(ReactDOM.findDOMNode(this.refs.cmodal)).modal('hide');
		    $(ReactDOM.findDOMNode(this.refs.cmodal)).find("input,textarea,select").val('').end()
		     .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
		 },
	 	changeComment:function(event){
	 		const field = event.target.name;
	        const comment = this.state.comment;
	        comment[field] = event.target.value;
	        this.setState({comment:comment});
		 },
	  	//////
     render:function(){
     	var projectsName=[];
     	if(this.state.projectsName){
		  	 projectsName=this.state.projectsName.map (function(projectName) {
				return (
				<Options key={projectName._id} projectName={projectName}></Options>
				)
			});
	   }
		return(
        <div className="row">
                    <div className="col-lg-12">
                    	<div className="row">
                    		<div className="col-sm-6">
                        	<h2 className="page-header">Tasks</h2>
                        	</div>
                        	<div className="col-sm-6" >
                        		<h6>Select Project</h6>
                        		<select className="selectpicker pull-right" onChange={this.onProjectSelectionChange}>
							  		{projectsName}
								</select>
                        	</div>
                        </div>
                        <div className="row">
	                        <div className="col-sm-6">
	                            <div className="dt-buttons btn-group">
	                                <button className={this.state.selectedTasks.length==0?"btn btn-primary active":"btn btn-primary disabled"} onClick={this.handleShowModal}  disabled={this.state.selectedTasks.length!=0}>New</button>
	                                <button className={this.state.selectedTasks.length==1?"btn btn-primary active":"btn btn-primary disabled"} onClick={this.handleShowModal} disabled={this.state.selectedTasks.length!=1}>Edit</button>                
	                                <button className={this.state.selectedTasks.length!=0?"btn btn-primary active":"btn btn-primary disabled"} onClick={this.handleDeletion} disabled={this.state.selectedTasks.length==0}>Delete</button>
	                            </div>
	                        </div>
	                        <div className="col-sm-6">
	                        	<div id="example_filter" className="dataTables_filter">
	                        		<label>Search:<input type="search" className="form-control input-sm" placeholder="" aria-controls="example"/></label>
	                        	</div>
	                        </div>
                        </div>
                    </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                               All Tasks Of Selected Project
                            </div>
                            <div className="panel-body">
                                <TaskTable tasks={this.state.tasks} handleSelection={this.handleSelection} handleComment={this.showCModal}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-lg-12">
                	<TaskDialog onSubmitTask={this.AddTask} task={this.state.task} ref='taskmodal' onChangeInput={this.changeTask} onCloseDialog={this.closeDialog}></TaskDialog>
            	</div>
            	<div className="row col-lg-12">
                	<ComentDialog onSubmitComment={this.AddComment} comment={this.state.comment} ref='cmodal' onChangeInput={this.changeComment} onCloseDialog={this.hideCModal}></ComentDialog>
            	</div>
        </div>
		)
	}
 
});
Options=React.createClass({
  
    render: function(){
    return (
       <option value={this.props.projectName._id}>{this.props.projectName.p_name}</option>
	)
	}
});
TaskTable = React.createClass({
    render: function(){
       var tasks =[],self=this;
	   if(this.props.tasks){
		   tasks=this.props.tasks.map (function(task) {
				return (
				<TaskObj key={ task._id } task={ task } handleSelection={self.props.handleSelection} handleComment={self.props.handleComment}></TaskObj>
				)
			});
	   }

        return  (
			<div className="table-responsive" >
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr role="row">
                        	<th className="center-block"><input type="checkbox" /></th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Estimation</th>
                            <th>Updated_at</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        { tasks}
                    </tbody>
                </table>
            </div>
            
		)
	}
});

TaskObj = React.createClass({
  	clickCheckBox:function(e){
        if (e.target.type !== 'checkbox') {
        	var check=false;
        	var clickVal=$(e.target).siblings().find('input#tid').val();
            $(e.target).siblings().find('input:checkbox:first').prop('checked', function( i, val ) {
               check=!val;
                return !val;
            });
            this.props.handleSelection(clickVal,check);
        }
        console.log(e);
    },
    render: function(){

    return (
       <tr className="" role="row" onClick={this.clickCheckBox}>
       		<td className="center-block"><input type="checkbox" /></td>
       		<td hidden><input type="hidden" id="tid" value={this.props.task._id}/></td>
            <td className="">{ this.props.task.name }</td>
            <td className="">{ this.props.task.description }</td>
            <td className="">{ this.props.task.status}</td>
            <td className="">{ this.props.task.estimation}</td>
            <td className="">{ new Date(this.props.task.updated_at).toDateString()}</td>
            <td className="" onClick={this.props.handleComment}><button className="btn btn-primary">Add Comment</button></td>
        </tr>
	)
	}
});
TaskDialog=React.createClass({
    render:function(){
        return (
            <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onCloseDialog}><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">{this.props.task._id?'Edit Task':'Add Task'}</h4>
                </div>
                <div className="modal-body">
                 <form className="form-horizontal" onSubmit={this.props.onSubmitTask}>
                    <fieldset>

                        <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputp_name">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="name" placeholder="Name" value={this.props.task.name} onChange={this.props.onChangeInput} disabled={this.props.task._id}/>
                            </div>
                         </div>

                           <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputdescription">Description</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="description" placeholder="Description" value={this.props.task.description} onChange={this.props.onChangeInput}/>
                            </div>
                         </div>
                         
                          <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputStatus">Status</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="status" placeholder="Status" value={this.props.task.status} onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                          <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputEstimation">Estimation</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="estimation" placeholder="Estimation" value={this.props.task.estimation} onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                       </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.props.onCloseDialog}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={this.props.onSubmitTask}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});
ComentDialog=React.createClass({
    render:function(){
        return (
            <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onCloseDialog}><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Add Comment</h4>
                </div>
                <div className="modal-body">
                 <form className="form-horizontal" onSubmit={this.props.onSubmitComment} id="commentForm" enctype="multipart/form-data">
                    	<fieldset>
                    	 <div className="form-group">
                    		<input type="hidden" id="tid" name="tid" value={this.props.comment.task_id}/>
                    		</div>
                        <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputp_name">Details</label>
                            <div className="col-sm-10">
                                <textarea rows="3" className="form-control" name="details" placeholder="Details" value={this.props.comment.details} onChange={this.props.onChangeInput} />
                            </div>
                         </div>

                           <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputdescription">Select File</label>
                            <div className="col-sm-10">
                                <input type="file" className="form-control" id="attachment" name="attachment" />
                            </div>
                         </div>
                       </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.props.onCloseDialog}>Close</button>
                  <button type="submit" className="btn btn-primary" onClick={this.props.onSubmitComment}>Save comment</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});

