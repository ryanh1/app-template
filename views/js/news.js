var socket = io();

console.log('js is loaded');

socket.on('connect', function () {
  console.log('Connected to server');
  socket.emit('requestHeadlines');


});

socket.on('deliverHeadlines', function(data) {
  console.log('Headlines delivered from server');
  for (i in data.headlines) {


    var rowNum = document.createElement('th');
      var index = +i + +1;
      rowNum.innerHTML = index;
      var att = document.createAttribute('scope');
        att.value = 'row';
        rowNum.setAttributeNode(att);


    var line = document.createElement('td');
      line.innerHTML = data.headlines[i];

    var row = document.createElement('tr');
      row.appendChild(rowNum);
      row.appendChild(line);
      if (+i % +2 === 1) {
        var att = document.createAttribute('class');
          att.value = 'table-active';
          row.setAttributeNode(att);
      }

    var headlines = document.getElementById("headlines");
    headlines.appendChild(row);

    var dateEl = document.getElementById("date");
    var date = moment().format("LL");
    dateEl.innerHTML = date;
  }
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
