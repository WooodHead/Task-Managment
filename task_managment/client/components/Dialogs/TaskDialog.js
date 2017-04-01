var React = require('react');
var Auth =require('../modules/Auth1');
var ReactDOM = require('react-dom');
module.exports=TaskDialog=React.createClass({
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