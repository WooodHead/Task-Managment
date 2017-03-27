var React = require('react');
var Auth =require('../modules/Auth1');
var ReactDOM = require('react-dom');
module.exports=ViewComments=React.createClass({
    render:function(){
        var comments =[];
        if(this.props.comments&&this.props.comments.length>0){
         comments=this.props.comments.map(function(comment) {
          return (
          <CommentObj key={ comment._id } comment={ comment } ></CommentObj>
          )
        });
       }
        return (
            <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">All Comment</h4>
                </div>
                <div className="modal-body">
                 {comments.length>0 ?comments:''}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal" >Close</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});
CommentObj = React.createClass({
    render: function(){

    return (
       <div className="row" >
          <div className="col-lg-8">{this.props.comment.details}</div>
          <div className="col-lg-4">
            <div className="row col-sm-12" >{this.props.comment.user_id}</div>
            <div className="row col-sm-12" >{new Date(this.props.comment.created_at).toDateString()}</div>
          </div>
          <hr/>
      </div>
  )
  }
});