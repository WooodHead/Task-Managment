var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Create a new schema for our users data
var schema = new mongoose.Schema({
    name       : {
        type: String,
        index: { unique: true }
    },
    email    : {
        type: String,
        index: { unique: true }
    },
    phoneNo       : String,
    password:String
});
//compare password
schema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};
// The pre-save hook method
schema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')){
    return next();
  } 

  return bcrypt.genSalt(function (saltError, salt){
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, function(hashError, hash) {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

schema.statics.getUsersByQuery = function(queryparams,projection, callback) {

  var tasks = [];
  // Query the db, using skip and limit to achieve page chunks
  User.find(queryparams,projection,{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      users = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(tasks);

  });

};
// Create a static getuserss method to return users data from the db
schema.statics.getUsers = function(page, skip, callback) {

  var users = [];
  // Query the db, using skip and limit to achieve page chunks
  User.find({},'name email phoneNo',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      users = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(users);

  });

};
// get user by email
schema.statics.getUserByEmail = function(useremail, callback) {

  var user = [];
  // Query the db, using skip and limit to achieve page chunks
  User.findOne({email:useremail},'name email phoneNo',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      user = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(user);

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