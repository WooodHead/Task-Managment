var React = require('react');
var ReactDOM = require('react-dom');
var Auth =require('./modules/Auth1');

module.exports=Projects = React.createClass({

     getInitialState: function(props){
		 props = props || this.props;
        return {projects:props.projects,
                errors:props.errors,
                project:{
                    _id:'',
                    p_name:'',
                    description:'',
                    status:'',
                    estimation:''
                }
                };
	},
    componentDidMount: function(){

        var self=this;
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/getProjectByUser');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
        xhr.addEventListener('load', function(){
          if (xhr.status === 200) {
            var projects=JSON.parse(xhr.responseText);
            self.setState({
              projects: projects
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
    handleHideModal:function(){
        this.setState({view: {showModal: false}})
    },
    handleShowModal:function(){
        $(ReactDOM.findDOMNode(this.refs.projectmodal)).modal();

    },
    changeProject:function(event) {
        const field = event.target.name;
         const project = this.state.project;
        project[field] = event.target.value;

        this.setState({project:project});
  },
  processForm:function(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

   /* console.log('name:', this.state.user.name);
    console.log('email:', this.state.user.email);
    console.log('password:', this.state.user.password);*/
    // create a string for an HTTP body message
        var request = new XMLHttpRequest(), self = this;
        request.open("POST", "/api/addProject", true);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
        request.onreadystatechange = function() {//Call a function when the state changes.
            if(request.readyState == 4 && request.status == 200) {
            var updated =[];
            if(self.state.projects)
                updated=self.state.projects;
      // Push them onto the end of the current tweets array
            if(request.responseText){
                updated.push(JSON.parse(request.responseText));
            }
            self.setState({projects: updated});
            }
            $(ReactDOM.findDOMNode(self.refs.projectmodal)).modal('hide');
            $(ReactDOM.findDOMNode(self.refs.projectmodal)).find("input,textarea,select").val('').end()
            .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
         }
        request.send(JSON.stringify({project:self.state.project}));

  },
    render:function(){
		return(
            <div >
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="page-header">Projects</h2>
                        <div className="row">
                        <div className="col-sm-6">
                            <div className="dt-buttons btn-group">
                                <button className="btn btn-info btn-lg" onClick={this.handleShowModal}>New</button>
                                <button className="btn btn-info btn-lg" onClick={this.handleShowModal}>Edit</button>                
                                <button className="btn btn-info btn-lg" >Delete</button>
                            </div>
                        </div>
                        <div className="col-sm-6">
                        <div id="example_filter" className="dataTables_filter">
                        <label>Search:<input type="search" className="form-control input-sm" placeholder="" aria-controls="example"/></label>
                        </div></div></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                               All Projects
                            </div>
                            <div className="panel-body">
                                <ProjectsTable projects={this.state.projects }/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-lg-12">
                <ProjectDialog ref='projectmodal' errors={this.state.errors} onChangeInput={this.changeProject} onSubmitForm={this.processForm}/>
                </div>
            </div>            
		)
	}

});

ProjectsTable= React.createClass({
    render: function(){
       var projects =[];
       if(this.props.projects){
           projects=this.props.projects.map (function(project) {
                return (
                <ProjectObj key={ project._id } project={ project }></ProjectObj>
                )
            });
       }

        return  (
            <div className="table-responsive" data-toggle="table"   data-click-to-select="true">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr role="row">
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Estimation</th>
                            <th>Updated_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        { projects}
                    </tbody>
                </table>
            </div>
        )
    }
});
ProjectObj = React.createClass({
  
    render: function(){

    return (
        <tr className="" role="row">
            <td className="">{ this.props.project.p_name }</td>
            <td className="">{ this.props.project.description }</td>
            <td className="">{ this.props.project.status}</td>
            <td className="">{ this.props.project.estimation}</td>
            <td className="">{ this.props.project.updated_at}</td>

        </tr>
    )
    }
});
ProjectDialog=React.createClass({
    render:function(){
        return (
            <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Add Project</h4>
                </div>
                <div className="modal-body">
                 <form className="form-horizontal" onSubmit={this.props.onSubmitForm}>
                    <fieldset>

                        <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputp_name">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="p_name" placeholder="Name" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                           <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputdescription">Description</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="description" placeholder="Description" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>
                         
                          <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputStatus">Status</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="status" placeholder="Status" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                          <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputEstimation">Estimation</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="estimation" placeholder="Estimation" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                       </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={this.props.onSubmitForm}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});