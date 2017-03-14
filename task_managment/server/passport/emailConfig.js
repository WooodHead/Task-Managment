const User = require('mongoose').model('User');
var mongoose = require('mongoose');
var nev = require('email-verification')(mongoose);
nev.configure({
    verificationURL: 'http://localhost:8081/email-verification/${URL}',
    persistentUserModel: User,
    expirationTime: 600, 
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'zeeshanmz888@gmail.com',
            pass: 'phQ786zmgm2'
        }
      }
    // },
    // verifyMailOptions: {
    //     from: 'Do Not Reply <zeeshanmz888@gmail.com>',
    //     subject: 'Please confirm account',
    //     html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
    //     text: 'Please confirm your account by clicking the following link:+${URL}'
    // }
}, function(err, options){
  if (err) {
    console.log(err);
    return;
  }
  console.log('configured: ' + (typeof options === 'object'));
});
 nev.generateTempUserModel(User, function(err, tempUserModel) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});
module.exports = nev;