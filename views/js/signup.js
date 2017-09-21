var socket = io();

console.log('js is loaded');

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

jQuery('#signup-form').on('submit', function (e) {
  e.preventDefault();

  var name = jQuery('#name');
  var email = jQuery('#email');
  // var password = jQuery('#password');
  var user = {
    name,
    email,
    // password
  }
  console.log(JSON.stringify(user));
});
