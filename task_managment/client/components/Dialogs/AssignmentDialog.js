var React = require('react');
var Auth =require('../modules/Auth1');
var ReactDOM = require('react-dom');
module.exports=AssignmentDialog=React.createClass({
    render:function(){
        return (
            <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onCloseDialog}><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Assignment Details</h4>
                </div>
                <div className="modal-body">
                 <form className="form-horizontal" onSubmit={this.props.onSubmitAssignment} >
                    	<fieldset>
                    	 <div className="form-group">
                    		<input type="hidden" id="tid" name="tid" value={this.props.assignment.task_id}/>
                    	</div>
                    	<div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputdescription">Email</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" name="email" placeholder="Email" value={this.props.assignment.email} onChange={this.props.onChangeInput}/>
                            </div>
                         </div>
                         <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputdescription">Subject</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="subject" placeholder="Subject" value={this.props.assignment.subject} onChange={this.props.onChangeInput}/>
                            </div>
                         </div>
                        <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputp_name">Email Details</label>
                            <div className="col-sm-10">
                                <textarea rows="3" className="form-control" name="details" placeholder="Details" value={this.props.assignment.details} onChange={this.props.onChangeInput} />
                            </div>
                         </div>
                  
                       </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.props.onCloseDialog}>Close</button>
                  <button type="submit" className="btn btn-primary" onClick={this.props.onSubmitAssignment}>Confirm and send Email</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});
