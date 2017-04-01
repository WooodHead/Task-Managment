var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
  details     : String,
  created_at :Date,
  user_id:String,
  task_id: String
});

// Create a static 
schema.statics.getCommentsByTaskId= function(taskid, callback) {

  var comments = [];
  // Query the db, using skip and limit to achieve page chunks
  Comment.find({task_id:taskid},'details created_at task_id user_id',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      comments = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(comments);

  });

};
// Create a static 
schema.statics.getCommentsByUserId= function(userid, callback) {

  var comments = [];
  // Query the db, using skip and limit to achieve page chunks
  Comment.find({user_id:userid},'details created_at task_id user_id',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      comments = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(comments);

  });

};
// Create a static 
schema.statics.getCommentsByUserAndTaskID= function(query, callback) {

  var comments = [];
  // Query the db, using skip and limit to achieve page chunks
  Comment.find({user_id:query.userid,task_id:query.taskid},'details created_at task_id user_id',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      comments = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(comments);

  });

};
schema.statics.addComment = function(comment, callback) {
	comment.created_at=new Date();

	var result = [];
  // Query the db, using skip and limit to achieve page chunks
  Comment.create(comment,function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};
// Return a Task model based upon the defined schema
module.exports = Comment = mongoose.model('Comment', schema);