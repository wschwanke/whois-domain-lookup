const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const whois = require('whois');
const csvParse = require('csv-parse');

let delimiter = ',' || argv.n;
let domainColName = 'Domain' || argv.d;
const regExp = /^Name Server.+?$/gm;
let nameServers = ''


// csvParser calls the csvParse function from csv-parse node module. The default delimiter is `,`,
// setting columns to true will return an array of objects with the key populated as the name of the column.
const csvParser = csvParse({ delimiter: ',', columns: true }, (err, data) => {
  // We set index to 1 instead of 0 because at index 0 we have the CSV headers
  for (let csvRow = 1; csvRow < data.length; csvRow++) {
    // We do a setTimeout becaue there is a limit to how often we can get info from the whois database
    setTimeout(() => {
      whois.lookup(data[csvRow][domainColName], (err, whois) => {
        if (err) {
          // If there is an error display it in the console
          console.error('Error: ', err);
        }
        
      });
    }, csvRow * 100);
  }
});

// Create the read stream for our file and parse it.
fs.createReadStream(__dirname + '/' + argv._[0]).pipe(csvParser);
