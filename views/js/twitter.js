var socket = io();

console.log('js is loaded');

socket.on('connect', function () {
  console.log('Connected to server');
  socket.emit('requestTweets');


});

/*
// HTML table with 2 columns and 2 rows
<table>
  <tr>
    <th>Month</th>
    <th>Savings</th>
  </tr>
  <tr>
    <td>January</td>
    <td>$100</td>
  </tr>
</table>
*/

socket.on('deliverTweets', function(data) {
  console.log('Tweets delivered from server');
  for (i in data.tweets) {

    // Create rows
    // var rowNum = document.createElement('th');
    //   var index = +i + +1;
    //   rowNum.innerHTML = index;
    //   var att = document.createAttribute('scope');
    //     att.value = 'row';
    //     rowNum.setAttributeNode(att);

    // Define author element
    var author = document.createElement('td');
      var authorString = data.tweets[i].author;
      if (authorString) {
        author.innerHTML = authorString;
      } else {
        author.innerHTML = "Anonymous";
      }

    // Define time element
    var time = document.createElement('td');
      var timeString = data.tweets[i].time;
      var timeMoment = moment(timeString);
      time.innerHTML = timeMoment.fromNow();

    // Define message element
    var message = document.createElement('td');
      message.innerHTML = data.tweets[i].message;

    // Create a row
    var row = document.createElement('tr');
      row.appendChild(author);
      row.appendChild(time);
      row.appendChild(message);
      if (+i % +2 === 1) {
        var att = document.createAttribute('class');
          att.value = 'table-active';
          row.setAttributeNode(att);
      }


    var tweets = document.getElementById("tweets");
    tweets.appendChild(row);

    var dateEl = document.getElementById("date");
    var date = moment().format("LL");
    dateEl.innerHTML = date;
  }
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
