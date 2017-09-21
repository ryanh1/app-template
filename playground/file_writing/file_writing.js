const fs = require('fs');

fs.appendFile('./playground/file_writing/test_file.txt', 'Hello world! ', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});

fs.writeFileSync('./playground//file_writing/test_file_2.json','text_string');

var noteString = fs.readFileSync('./playground/file_writing/test_file.txt', 'utf8');

console.log(noteString);
