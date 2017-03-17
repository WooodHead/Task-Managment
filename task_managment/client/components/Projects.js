var React = require('react');
var ReactDOM = require('react-dom');
var Auth =require('./modules/Auth1');

module.exports=Projects = React.createClass({

     getInitialState: function(props){
		 props = props || this.props;
        return {projects:props.projects,
                errors:props.errors,
                view: {showModal: true}
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
        console.log(ReactDOM);
        console.log(ReactDOM.findDOMNode(this.refs.modal));
        $(ReactDOM.findDOMNode(this.refs.modal)).modal();

    },
    render:function(){
		return(
            <div >
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Projects</h1>
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
                <ProjectDialog ref='modal'/>
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
            <div className="table-responsive">
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
                  <p>modal body</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});