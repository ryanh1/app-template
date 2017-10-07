var request = require('request');

// Define request function
var geocodeAddress = (address, callback) => {
  // encode address
  var encodedAddress = encodeURIComponent(address);

  // request data
  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Unable to conncet to Google servers.');
    } else if (body.status === 'ZERO_RESULTS') {
      callback('Unable to find that address.');
    } else if (body.status === 'OK') {
      // If there is no errorMessage, set the first argument = undefined
      callback(undefined, {
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      })
    }
  });
};

// Call request function
geocodeAddress('206 Washington Street, Boston, MA', (error, addressRequest) => {
  console.log(`Address: ${addressRequest.address}`)
  console.log(`latitude: ${addressRequest.latitude}`)
  console.log(`longitude: ${addressRequest.longitude}`)
});
