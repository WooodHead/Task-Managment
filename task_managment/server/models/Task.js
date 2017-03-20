var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    name        : { type: String, index: { unique: true }},
    description : String,
    status      : String,
    estimation  : String,
    created_at  : Date,
    updated_at  : Date,
    project_id  : String,
    user_id     : String
});

// Create a static 
schema.statics.getTasksByQuery = function(queryparams, callback) {

  var tasks = [];
  // Query the db, using skip and limit to achieve page chunks
  Task.find(queryparams,'name description status estimation created_at updated_at',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      tasks = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(tasks);

  });

};
// Create a static 
schema.statics.getTasksByProject = function(projectid, callback) {

  var tasks = [];
  // Query the db, using skip and limit to achieve page chunks
  Task.find({project_id:projectid},'name description status estimation created_at updated_at',{}).exec(function(err,docs){

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
schema.statics.editTask = function(id,task, callback) {
    task.updated_at=new Date();
  // Query the db, using skip and limit to achieve page chunks
  var result;
  Task.findOneAndUpdate({ "_id": id }, { "$set":{description:task.description,status:task.status,estimation:task.estimation,updated_at:task.updated_at}},{new: true},function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};
schema.statics.deleteTasks = function(tasks, callback) {

  // Query the db, using skip and limit to achieve page chunks
  Task.remove({_id:{$in:tasks}},function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};

// Return a Task model based upon the defined schema
module.exports = Task = mongoose.model('Task', schema);