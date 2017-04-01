var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
  filename     :String, 
  originalname:String, 
  path:String,
  mimetype:String,
  size:Number,
  encoding:String,
  upload_at:Date,
  user_id:String,
  task_id: String
});

// Create a static 
schema.statics.getAttachment= function(userid, skip, callback) {

  var Attachment = [];
  // Query the db, using skip and limit to achieve page chunks
  Attachment.find({users:userid},'p_name description estimation status created_at updated_at users',{}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      projects = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(projects);

  });

};
schema.statics.addAttachment = function(attachment, callback) {
  var result = [];
  // Query the db, using skip and limit to achieve page chunks
  attachment.upload_at=new Date();
  Attachment.create(attachment,function(err,docs){

    // If everything is cool...
    if(!err) {
      result = docs;  // We got users
    }

    // Pass them back to the specified callback
    callback(result);

  });

};

// Return a Task model based upon the defined schema
module.exports = Attachment = mongoose.model('Attachment', schema);