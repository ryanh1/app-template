var express               = require('express');
var router                = express.Router();
var passport              = require('passport');
var LocalStrategy         = require('passport-local').Strategy;
var moment                = require('moment');

// Require self-made files
var User                  = require('../models/user');
var Tweet                 = require('../models/tweet');
var secret                = require('../config/secret');

require('../middleware/authenticate');


// Get Homepage
router.get('/', (req, res) => {
  res.render('html/index.hbs', {
    pageTitle: 'Home Page',
  });
});


// About page
router.get('/about', (req, res) => {
  res.render('html/about.hbs', {
    pageTitle: 'About Page',
  });
});


// News page
router.get('/news', (req, res) => {
  res.render('html/news.hbs', {
    pageTitle: 'News Page',
  });
});

// Map page
var googleMapsURL = `//www.google.com/maps/embed/v1/place?q=Harrods,Brompton%20Rd,%20UK&zoom=17&key=${secret.googleMapsApiKey}`;
router.get('/map', (req, res) => {
  res.render('html/map.hbs', {
    pageTitle: 'Map Page',
    googleMapsURL: googleMapsURL
  });
});

// Signup page
router.get('/signup', (req, res) => {
  console.log('Get signup page');
  res.render('html/signup.hbs', {
    pageTitle: 'Sign up',
  });
});


// Sign up user
router.post('/signup',
  passport.authenticate('local-signup', {successRedirect:'/profile', failureRedirect:'/login',failureFlash: true})
);


// Log in page
router.get('/login', (req, res) => {
  res.render('html/login.hbs', {
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
router.get('/profile', ensureAuthenticated, (req, res, done) => {
  var userID = req.session.passport.user;

  User.getUserById(userID, function(err, user) {
    if(err){
      throw err
    };
    if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}
    if(user) {
      var name = user.name;
      var email = user.email;
      res.render('html/profile.hbs', {
        pageTitle: 'Profile page',
        name: name,
        email: email
      });
    }
  });
});


// Log out
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});


// Get SMS page
router.get('/sms', (req, res) => {
  res.render('html/sms.hbs', {
    pageTitle: 'Text somebody',
  });
});


// POST log in
router.post('/sms',
  function(req, res) {
    require('../workers/twilio_message');
    res.redirect('profile');
  }
);


// Get SMS page
router.get('/twitter', (req, res) => {
  res.render('html/twitter.hbs', {
    pageTitle: 'Twitter',
  });
});

// POST tweet
router.post('/twitter',
  function(req, res) {

    // Set tweet structure
    var author;
    var time;
    var message;

    // Validate message
    message = req.body.message;
    req.checkBody('message', 'Message is required').isLength({ min: 1});
    var errors = req.validationErrors();

    // If there are errors, render the twitter page and pass those errors in
    if(errors){
        req.res.render('twitter',{
          errors:errors
        });
    } else {

      // Else, create a new tweet, starting with time
      time = moment();

      // If the user is not logged in, set author to "Anonymous"
      if(!req.isAuthenticated()){
        author = "Anonymous";
        saveTweet(author, message, time, res);
      } else {
        // If the user is logged in, the user id can be retrieved with console.log(req.session.passport.user);
        User.getUserById(req.session.passport.user, function(err, user){
          if(err) throw err;
          if(!user) {
            return done(null, false, {message: 'The user cannot be found.'});
          } else {
            author = user.name;
            saveTweet(author, message, time, res);
          }
        });
      }
    }
  }
);

function saveTweet(author, message, time, res) {
  // Create newTweet variable
  var newTweet = new Tweet({
    author: author,
    message: message,
    time: time
  });

  // Save the user to the database
  Tweet.createTweet(newTweet, function(err, tweet){
    if(err) throw err;
    console.log("Saved tweet to database: ", JSON.stringify(tweet));
    res.redirect('twitter');
  });
}

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
