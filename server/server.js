// Require modules
require('./config/config');

const path              = require('path');
const express           = require('express');
const hbs               = require('hbs');
const http              = require('http');
const socketIO          = require('socket.io');
const mocha             = require('mocha');
const expect            = require('expect');
const bodyParser        = require("body-parser");
const cookieParser      = require("cookie-parser");
const lodash            = require("lodash");
const {ObjectID}        = require('mongodb');
const fs                = require('fs');
const passport          = require('passport');
const expressValidator  = require('express-validator');
const flash             = require('connect-flash');
const session           = require('express-session');
const scraperjs         = require('scraperjs');


// Require self created files
var {mongoose}          = require('./db/mongoose');
var {User}              = require('./models/user');
var Tweet               = require('./models/tweet');
var routes              = require('./routes/routes');
var secret              = require('./config/secret');
// var users = require('./routes/users');


// Define server port
const port = process.env.PORT;




// Init Express App
var app = express();

// Prepare view engine
app.set('view engine', 'hbs');

// Configure root directory of files served to client
const publicPath = path.join(__dirname, '../views/');
app.use(express.static(publicPath));

// Configure partials directory
hbs.registerPartials(__dirname + '/../views/partials');

// Set up server and socket
var server = http.createServer(app);
var io = socketIO(server);


// Configure express app
app.use(bodyParser.urlencoded({ extended: false }));



// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Express Session
app.use(session({
    secret: secret.authSecret,
    // Force new session to be saved to store
    saveUninitialized: true,
    // Forces session to be re-saved back to store even if not modified.
    // Optimal value depends on store.
    resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect Flash
app.use(flash());


// Global Vars for Flash
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



// Prefixes
app.use('/', routes);
// app.use('/users', users);



// Register hbs helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});



// Socket.io
io.on('connection', function(socket){
  console.log('New user connected');
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });

  // Static news scraper
  socket.on('requestHeadlines', function() {
    console.log('Headlines requested from client');
    scraperjs.StaticScraper.create('https://news.google.com/news/headlines?ned=us&hl=en')
      .scrape(function($) {
          return $('a[role="heading"]').map(function() {
              return $(this).text();
          }).get();
      })
      .then(function(news) {
          // Socket.io
            socket.emit('deliverHeadlines', {headlines: news});
              console.log('Headlines delivered to client');
      });
  });

  // Tweets
  socket.on('requestTweets', function() {
    console.log('Tweets requested from client');
    Tweet.getAllTweets(function(err, tweets){
    	if(err) throw err;
      socket.emit('deliverTweets', {tweets: tweets});
        console.log('Tweets delivered to client: ', JSON.stringify(tweets));
    });
  })

});

// Set up server listening
server.listen(port, () => {
  console.log(`Server is started on port ${port}`)
});
