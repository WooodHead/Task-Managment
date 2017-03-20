var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
  p_name     : { type: String, index: { unique: true }},
  description: String,
  estimation : String,
  status     :String,
  created_at :Date,
  updated_at :Date,
  users      :[{ type : String, ref: 'User' }]

});

// Create a static 
schema.statics.getProjects= function(userid, callback) {

  var projects = [];
  // Query the db, using skip and limit to achieve page chunks
  Project.find({users:userid},'p_name description estimation status created_at updated_at users',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      projects = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(projects);

  });

};
schema.statics.getProjectsName = function(userid, callback) {

  var projects = [];
  // Query the db, using skip and limit to achieve page chunks
  Project.find({users:userid},'p_name',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      projects = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(projects);

  });

};
schema.statics.addProject = function(project, callback) {
  project.created_at=new Date();
  project.updated_at=new Date();
  var result = [];
  // Query the db, using skip and limit to achieve page chunks
  Project.create(project,function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};
schema.statics.editProject = function(id,project, callback) {
  project.updated_at=new Date();
  var result = [];
  // Query the db, using skip and limit to achieve page chunks
  Project.findOneAndUpdate({ "_id": id }, { "$set":{description:project.description,status:project.status,estimation:project.estimation,updated_at:project.updated_at}},{new: true},function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};
schema.statics.deleteProjects = function(projects, callback) {

  // Query the db, using skip and limit to achieve page chunks
  Project.remove({_id:{$in:projects}},function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};

// Return a Task model based upon the defined schema
module.exports = Project = mongoose.model('Project', schema);