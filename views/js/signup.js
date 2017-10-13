var socket = io();

console.log('js is loaded');

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// jQuery('#signup-form').on('submit', function (e) {
//   // e.preventDefault();
//
//
//   var email = jQuery('#email').val();
//   var password = jQuery('#password').val();
//   var user = {
//     email,
//     password
//   }
//
//   axios.post('/users', user)
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// });
