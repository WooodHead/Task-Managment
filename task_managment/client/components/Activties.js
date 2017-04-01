var React = require('react');
var Auth =require('./modules/Auth1');
var ReactDOM = require('react-dom');
var ViewComments=require('./Dialogs/ViewComments');
var TaskDialog=require('./Dialogs/TaskDialog'),
    ComentDialog=require('./Dialogs/ComentDialog');
module.exports=Activties = React.createClass({

        getInitialState: function(props){
            props = props || this.props;
            return {
                tasks:props.tasks,
                errors:props.errors,
                selectedActivties:[],
                task:{},
                comment:{},
                comments:props.comments,
            };
        },
        loadTasksByUser:function(){
            var self=this;
            const xhr = new XMLHttpRequest();
            xhr.open('get', '/api/getTasksByUser');
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
        componentDidMount: function(){

            this.loadTasksByUser();
        },
        updateTask: function(e){
        
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
                        updated = updated.filter(function( obj ) {
                            return obj._id !== self.state.task._id;
                        });
                        updated.push(JSON.parse(request.responseText));
                        self.setState({tasks: updated,task:{},selectedActivties:[]});
                        $(ReactDOM.findDOMNode(self.refs.acttable)).find("input[type=checkbox]").prop("checked", "").end();
                    }
                      $(ReactDOM.findDOMNode(self.refs.actmodal)).modal('hide');
                    $(ReactDOM.findDOMNode(self.refs.actmodal)).find("input,textarea,select").val('').end()
                    .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
                }
            }
            request.send(JSON.stringify({task:self.state.task}));
        },
        handleDeletion:function(){
            var request = new XMLHttpRequest(), self = this;
                request.open("DELETE", "/api/deleteTasks", true);
                request.setRequestHeader("Content-type", "application/json");
                request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
                request.onreadystatechange = function() {//Call a function when the state changes.
                    if(request.readyState == 4 && request.status == 200) {
                        console.log(request);
                        self.loadTasksByUser();
                        self.setState({
                            selectedActivties:[]
                        });
                    }
                }
                request.send(JSON.stringify({taskids:self.state.selectedActivties}));
        },
        handleHideModal:function(){
            this.setState({view: {showModal: false}})
        },
        handleShowModal:function(){
            if(this.state.selectedActivties.length==1){
                var self=this;
                var result = this.state.tasks.filter(function( obj ) {
                  return obj._id ==self.state.selectedActivties[0];
                });
                this.setState({
                    task:result[0]
                });
            }
            $(ReactDOM.findDOMNode(this.refs.actmodal)).modal();

        },
        closeDialog:function(){
             $(ReactDOM.findDOMNode(this.refs.actmodal)).find("input,textarea,select").val('').end()
                    .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
                    this.setState({
                        task:''
                    });
         },
        handleSelection:function(val,flag){
            if(flag){
                this.setState({ 
                    selectedActivties: this.state.selectedActivties.concat([val])
                });
            }else{
                var updatedIds=this.state.selectedActivties;
                var index=updatedIds.indexOf(val);
                if(index>-1){
                    updatedIds.splice(index,1);
                }
                this.setState({ 
                    selectedActivties: updatedIds
                });
                }
        },
        changeTask:function(event) {
            const field = event.target.name;
             const task = this.state.task;
            task[field] = event.target.value;
            this.setState({task:task});
      },
      // Add Comment
        AddComment:function(e){
            e.preventDefault();
            var request = new XMLHttpRequest(), self = this;
            var file = $("#attachment")[0].files[0];
            var FD = new FormData();
            FD.append('comment',JSON.stringify(self.state.comment));
            FD.append("attachment", file);
            request.open("POST", "/api/addComment", true);
            request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
            request.onreadystatechange = function() {//Call a function when the state changes.
                if(request.readyState == 4 && request.status == 200) {
                    self.setState({
                        comment:{}
                    });
                    self.hideCModal();
                }
                
            }
            request.send(FD);
        },
        showCModal:function(e){
            e.stopPropagation();
            if(e.target.type=='submit'){
                var taskid=$(e.target).parent().siblings().find('input#tid').val();
                if(taskid){
                    if(e.target.id=='view1'){
                     const xhr = new XMLHttpRequest(),self=this;
                      xhr.open('get', '/api/getCommentByTask?taskid='+taskid, true);
                      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                      xhr.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
                      xhr.addEventListener('load', function(){
                        if (xhr.status === 200) {
                          var comments=JSON.parse(xhr.responseText);
                          self.setState({
                            comments: comments
                          });
                           $(ReactDOM.findDOMNode(self.refs.ViewComment)).modal();
                        } else {
                         
                        }
                      });
                      xhr.send(null);
                    }else{
                        this.setState({
                            comment:{task_id:taskid}
                        });
                        $(ReactDOM.findDOMNode(this.refs.cmodal)).modal();
                    }
                }
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

      ///

     render:function(){
        return(
        <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <h2 className="page-header">Current Tasks</h2>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="dt-buttons btn-group">
                                    <button className={this.state.selectedActivties.length==1?"btn btn-primary active":"btn btn-primary disabled"} onClick={this.handleShowModal} disabled={this.state.selectedActivties.length!=1}>Edit</button>                
                                    <button className={this.state.selectedActivties.length!=0?"btn btn-primary active":"btn btn-primary disabled"} onClick={this.handleDeletion} disabled={this.state.selectedActivties.length==0}>Delete</button>
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
                               All Tasks
                            </div>
                            <div className="panel-body">
                                <ActivityTable ref='acttable' tasks={this.state.tasks } handleSelection={this.handleSelection} handleComment={this.showCModal}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-lg-12">
                    <TaskDialog onSubmitTask={this.updateTask} task={this.state.task} ref='actmodal' onChangeInput={this.changeTask} onCloseDialog={this.closeDialog}></TaskDialog>
                </div>
                <div className="row col-lg-12">
                    <ComentDialog onSubmitComment={this.AddComment} comment={this.state.comment} ref='cmodal' onChangeInput={this.changeComment} onCloseDialog={this.hideCModal}></ComentDialog>
                </div>
                <div className="row col-lg-12">
                    <ViewComments  ref='ViewComment' comments={this.state.comments}></ViewComments>
                </div>
        </div>
        )
    }
 
});
ActivityTable = React.createClass({
    render: function(){
       var tasks =[],self=this;
       if(this.props.tasks){
           tasks=this.props.tasks.map (function(task) {
                return (
                <ActivityObj key={ task._id } task={ task } handleSelection={self.props.handleSelection} handleComment={self.props.handleComment}></ActivityObj>
                )
            });
       }

        return  (
            <div className="table-responsive" >
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr role="row">
                            <th ></th>
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

ActivityObj = React.createClass({
    clickCheckBox:function(e){
        
        if (e.target.type !== 'checkbox') {
            var check=false;
            var clickVal=$(e.target).siblings().find('input#tid').val();
            console.log(clickVal);
            $(e.target).siblings().find('input:checkbox:first').prop('checked', function( i, val ) {
                check=!val;
                return !val;
            });
            this.props.handleSelection(clickVal,check);
        }
        
    },
    render: function(){

    return (
       <tr className="" role="row" onClick={this.clickCheckBox}>
            <td className="center-block"><input type="checkbox" /></td>
            <td hidden ><input type="hidden" id="tid" value={this.props.task._id}/></td>
            <td className="">{ this.props.task.name }</td>
            <td className="">{ this.props.task.description }</td>
            <td className="">{ this.props.task.status}</td>
            <td className="">{ this.props.task.estimation}</td>
            <td className="">{ new Date(this.props.task.updated_at).toDateString()}</td>
            <td className="" onClick={this.props.handleComment}><button className="btn btn-primary">Add</button><button id="view1" className="btn btn-primary">View</button></td>
        </tr>
    )
    }
});
