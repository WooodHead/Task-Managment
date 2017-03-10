var mongoose = require('mongoose');

// Create a new schema for our users data
var schema = new mongoose.Schema({
	id1: String
   , name       : String
  , email     : String
  , designation     : String
  , phoneNo       : String
  , Tasks       : []
});

// Create a static getuserss method to return users data from the db
schema.statics.getUsers = function(page, skip, callback) {

  var users = [];
  // Query the db, using skip and limit to achieve page chunks
  User.find({},'id1 name email designation phoneNo Tasks',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      users = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(users);

  });

};
schema.statics.addUser = function(user, callback) {

var users = [];
  // Query the db, using skip and limit to achieve page chunks
  User.create(user,function(err,docs){

    // If everything is cool...
    if(!err) {
      users = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(users);

  });

};
schema.statics.assignTaskToUser = function(assignment, callback) {

	var user = [];
  // Query the db, using skip and limit to achieve page chunks
  User.findById(assignment.user_id).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      user = docs;  // We got users
    }
	if(!(user.Tasks.indexOf(assignment.task_id)>-1)){
		user.Tasks.push(assignment.task_id);
	}
	user.save(function(err,docs){
		callback(docs);
	});
	
	
    // Pass them back to the specified callback
    
  });

};


// Return a users model based upon the defined schema
module.exports = User = mongoose.model('User', schema);