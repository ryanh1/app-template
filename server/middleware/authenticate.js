var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Require self-made files
var User = require('../models/user');

// Strategy for signup
// Passport sign up middlewear
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },  function(req, username, password, done) {

          // Sign up user
        	var name = req.body.name;
        	var email = req.body.email;
        	var password = req.body.password;
        	var password2 = req.body.password2;

        	// Validation
          // This checks each element of the request body
          // Then it posts errors in req.validationErrors

        	req.checkBody('name', 'Name is required').isLength({ min: 1});
        	req.checkBody('email', 'Email is required').isLength({ min: 1});
        	req.checkBody('email', 'Email is not valid').isEmail();
        	req.checkBody('password', 'Password is required').notEmpty();
          req.checkBody('password', 'Password must contain at least 6 characters').isLength({ min: 6 });
        	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

          var errors = req.validationErrors();

          // If there are errors, render the signup page and pass those errors in
        	if(errors){
          		req.res.render('signup',{
          		 	errors:errors
          		});
        	} else {

            // Else, check for that user in the database
            User.getUserByEmail(email, function(err, user){
              if(err) throw err;
              if(user) {
                return done(null, false, {message: 'A user with that email already exists'});
              }

              // Else, create a new user
              var newUser = new User({
                email: email,
                password: password,
                name: name
              });

              // Save the user to the database
              User.createUser(newUser, function(err, user){
                if(err) throw err;
                console.log(user);
                console.log('Saved user to database');

                User.getUserByEmail(email, function(err, user){
                    console.log('Retrieving user from database');
                    if(err) throw err;
                    if(!user) {
                      return done(null, false, {message: 'Unknown User'});
                    }

                    User.comparePassword(password, user.password, function(err, isMatch){
                        if(err) throw err;
                        if(isMatch){
                          return done(null, user);
                        } else {
                          return done(null, false, {message: 'Invalid password'});
                        }
                    });
                });
              });
            });

      		}
          // Send the positive flash message
      		// req.flash('success_msg', 'You are registered and can now login');
          // Redirect the user to the login page
      		// res.redirect('/login');
          // res.redirect('profile');
    }
));


// Strategy for login
passport.use('local', new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
   User.getUserByEmail(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = {passport};
