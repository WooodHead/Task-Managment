var React = require('react');
var Auth =require('../modules/Auth1');
var ReactDOM = require('react-dom');
module.exports=ComentDialog=React.createClass({
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