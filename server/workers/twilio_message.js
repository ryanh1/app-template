var secret = require('../config/secret');
var accountSid = secret.accountSid; // Your Account SID from www.twilio.com/console
var authToken = secret.authToken;
var called_number = secret.called_number;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

// console.log("called_number: ", called_number);
var first = called_number.substring(0, 2);
if (first != "+1") {
  called_number = "+1" + called_number;
  console.log('Called number: ', called_number);
} else {
  console.log('Called number: ', called_number);
}

client.messages.create({
    body: 'This is a test message',
    to: called_number,  // Text this number
    // mediaUrl: './img/budget_post.png',
    // to: '+13366244260',
    from: '+13367286110' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
