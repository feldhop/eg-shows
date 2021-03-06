var express = require('express');
var https = require('https');
var app = express();
var rawData;

// Use the environment variable or use a given port
var PORT = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

function getData () {

  return new Promise(function (resolve, reject){
    
    https.get(process.env.url + process.env.key, function(res) {

        rawData = '';
        res.on('data', function(chunk) { 
            rawData += chunk; 
        });

        res.on('end', function () {
            resolve(rawData);
        });

    }).on('error', function(e) {
        reject(e);
        console.error(e);
    });
  });
}

app.get('/', function (req, res) {
  dataPromise = getData().then(function(value) {
    var parsedData = JSON.parse(value);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(parsedData.data));
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});