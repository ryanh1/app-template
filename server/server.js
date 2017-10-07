// Require modules
require('./config/config');

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const http = require('http');
const socketIO = require('socket.io');
const mocha = require('mocha');
const expect = require('expect');
const {ObjectID} = require('mongodb');

var user_routes = require('./routes/user_routes');
var {mongoose} = require('./db/mongoose');
var {authenticate} = require('./middleware/authenticate');



// Set app constants
const publicPath = path.join(__dirname, '../views');
const port = process.env.PORT;


// Set up express app, server, hbs, and socket.io
var app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/../views/partials');
<<<<<<< HEAD

=======
>>>>>>> 6add527fdd3c7186be11c3cc3e045d42063cf2ad
var server = http.createServer(app);
var io = socketIO(server);

// Serve index page
app.use(express.static(publicPath));
app.use('/', user_routes);

<<<<<<< HEAD
=======

>>>>>>> 6add527fdd3c7186be11c3cc3e045d42063cf2ad
// Register hbs helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

<<<<<<< HEAD
app.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'Home Page',
  });
});

=======
>>>>>>> 6add527fdd3c7186be11c3cc3e045d42063cf2ad
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/signup', (req, res) => {
  res.render('signup.hbs', {
    pageTitle: 'Signup Page',
  });
});

// Socket.io
io.on('connection', function(socket){
  console.log('New user connected');
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
});

// Set up server listening
server.listen(port, () => {
  console.log(`Server is started on port ${port}`)
});
