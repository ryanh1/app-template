var express               = require('express');
var router                = express.Router();
var passport              = require('passport');
var LocalStrategy         = require('passport-local').Strategy;
var request               = require('request');

// Require self-made files
var User = require('../models/user');
require('../middleware/authenticate');


// Get Homepage
router.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'Home Page',
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

router.get('/map', (req, res) => {
  res.render('map.hbs', {
    pageTitle: 'Map Page',
  });
});

// Signup page
router.get('/signup', (req, res) => {
  console.log('Get signup page');
  res.render('signup.hbs', {
    pageTitle: 'Sign up',
  });
});


// Passport authentication middlewear
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
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

// Sign up user
router.post('/signup', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
  // This checks each element of the request body
  // Then it posts errors in req.validationErrors

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password is required').isLength({ min: 6 });
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  // If there are errors, render the signup page and pass those errors in
	if(errors){
		res.render('signup',{
			errors:errors
		});
	} else {
    // Else, create a new user
		var newUser = new User({
			username:email,
			password: password,
      name: name
		});

    // Save the user to the database
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

    // Send the positive flash message
		req.flash('success_msg', 'You are registered and can now login');

    // Redirect the user to the login page
		// res.redirect('/login');
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
    res.redirect('profile');
	}
});


// Log in page
router.get('/login', (req, res) => {
  res.render('login.hbs', {
    pageTitle: 'Log in',
  });
});

// POST log in
router.post('/login',
  passport.authenticate('local', {successRedirect:'/profile', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    res.redirect('profile');
  }
);


// Profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile.hbs', {
    pageTitle: 'Profile page',
  });
});


// Log out
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});


// Require user log in
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;
