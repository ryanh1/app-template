var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// Tweet Schema
var TweetSchema = mongoose.Schema({
  // Tweetname is going to the email
  author: {
		type: String,
    required: false,
    trim: true,
    unique: false,
	},
	message: {
		type: String,
    required: true,
    trim: true,
    unique: false
	},
  time: {
    type: String,
    required: false,
    unique: false
  }
});


// Create Tweet model based on the tweet schema
var Tweet = module.exports = mongoose.model('Tweet', TweetSchema);


module.exports.createTweet = function(newTweet, callback){
  newTweet.save(callback);
}

module.exports.getTweetsByEmail = function(email, callback){
	var query = {email: email};
	Tweet.find(query, callback);
}

module.exports.getAllTweets = function(callback){
	var query = {};
	Tweet.find(query, callback);
}

module.exports.getTweetById = function(id, callback){
	Tweet.findById(id, callback);
}
