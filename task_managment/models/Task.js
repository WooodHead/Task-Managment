var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    idt       : String
  , task_Name     : String
  , Description     : String
  , duration       : String
});

// Create a static 
schema.statics.getTasks = function(page, skip, callback) {

  var tasks = [];
  // Query the db, using skip and limit to achieve page chunks
  Task.find({},'idt task_Name Description duration',{}).exec(function(err,docs){

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