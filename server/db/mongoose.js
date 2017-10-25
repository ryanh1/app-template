var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/app-template', {
  useMongoClient: true
});


// Reset mongoDB database --> Commented out right now!
/*
var db = mongoose.connection;
db.dropDatabase();
*/

// Print connection error message
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

module.exports = {mongoose};
