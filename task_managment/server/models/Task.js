var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    name        : String,
    description : String,
    status      : String,
    estimation  : String,
    created_at  : Date,
    updated_at  : Date,
    project_id  : String,
    user_id     : String
});

// Create a static 
schema.statics.getTasksByProjectsAndUser = function(queryparam, callback) {

  var tasks = [];
  // Query the db, using skip and limit to achieve page chunks
  Task.find({queryparam},'name description status estimation',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      tasks = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(tasks);

  });

};
schema.statics.addTask = function(task, callback) {

var tasks = [];
    task.created_at=new Date();
    task.updated_at=new Date();
  // Query the db, using skip and limit to achieve page chunks
  Task.create(task,function(err,docs){

    // If everything is cool...
    if(!err) {
      tasks = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(tasks);

  });

};

// Return a Task model based upon the defined schema
module.exports = Task = mongoose.model('Task', schema);