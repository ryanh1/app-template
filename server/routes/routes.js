var express               = require('express');
var router                = express.Router();
var passport              = require('passport');
var LocalStrategy         = require('passport-local').Strategy;

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


// Sign up user
router.post('/signup',
  passport.authenticate('local-signup', {successRedirect:'/profile', failureRedirect:'/login',failureFlash: true})
);


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
    pageTitle: 'Profile page'
    // name: user.name,
    // email: user.email
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
