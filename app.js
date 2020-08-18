const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'prismic');
const events = require('events');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const EventEmitter = new events.EventEmitter();
const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    {id: 'title', title: 'Title'},
    {id: 'uid', title: 'UID'}
  ]
});

EventEmitter.on('prismic-done', (data) => {
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
});


fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    let csvData = [];
    files.forEach(function (file, index) {
      fs.readFile(path.join('prismic', file), 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        if(obj.type === 'blog') {
          csvData.push({title: obj.name, uid: obj.uid});
        }

        if(index === files.length-1) {
          EventEmitter.emit('prismic-done', csvData);
        }
        
      });
    });
});