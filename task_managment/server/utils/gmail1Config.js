//  var send = require('gmail-send')({
//   user: 'zeeshanmz888@gmail.com',               // Your GMail account used to send emails 
//   pass: 'phQ786zmgm2',             // Application-specific password 
//   to:   '',      // Send back to yourself 
//   // from:   '"User" <user@gmail.com>'  // from: by default equals to user 
//   // replyTo:'user@gmail.com'           // replyTo: by default undefined 
//   subject: 'test subject',
//   text:    'test text'
//   // html:    '<b>html text text</b>' 
// });
// module.exports = send;
var app = require('express')(),
    exphbs = require('express-handlebars'),
    mailer = require('express-mailer');
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'zeeshanmz888@gmail.com',
    pass: 'phQ786zmgm2'
  }
});
module.exports = app;