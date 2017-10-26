// Twilio
var accountSid; // Your Account SID from www.twilio.com/console
var authToken;
var called_number; // Phone number
var calling_number; // Twilio number used for calling.  Must reset this periodically.

// Google Maps
var googleMapsApiKey;

// Passport authentication
var authSecret;

module.exports = {accountSid, authToken, called_number, calling_number, googleMapsApiKey, authSecret};
