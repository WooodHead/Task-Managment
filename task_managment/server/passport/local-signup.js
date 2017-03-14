const User = require('mongoose').model('User');
var mongoose = require('mongoose');
var nev = require('./emailConfig');
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, function(req, email, password, done) {
  const userData = {
    email: email.trim(),
    password: password.trim(),
    name: req.body.name.trim()
  };

  const newUser = new User(userData);

  nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
    // some sort of error 
    if (err){
        // handle error... 
        return done(err);
      }
 
    // user already exists in persistent collection... 
    if (existingPersistentUser){
        // handle user's existence... violently. 
        return done('Email Already registered..');
      }
 
    // a new user 
    if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmail(email, URL, function(err, info) {
            if (err){
                // handle error... 
                 done(err);
              }
              done(null);
            // flash message of success 
        });
 
    // user already exists in temporary collection... 
    } else {
        // flash message of failure... 
        nev.resendVerificationEmail(email, function(err, userFound) {
          if (err) {
                      done(err);           
          }
         if (userFound) {
              done('An email has been sent to you, yet again. Please check it to verify your account.');
         } else {
            done('Your verification code has expired. Please sign up again.')
        }
      });
    }
});

  // newUser.save(function(err){
  //   if (err) { return done(err); }

  //   return done(null);
  // });
});