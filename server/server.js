// Require modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const http = require('http');
const socketIO = require('socket.io');
const mocha = require('mocha');
const expect = require('expect');

// Set app constants
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// Set up express app, server, hbs, and socket.io
var app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/../views/partials');
var server = http.createServer(app);
var io = socketIO(server);

// Server index page
app.use(express.static(publicPath));

// Register hbs helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
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
