var express = require('express');
var https = require('https');
var app = express();
var rawData;
var parsedData;

// Use the environment variable or use a given port
var PORT = process.env.PORT || 8080;

function splitShows (data) {
  var response = {}
  var currentDate = new Date();
  var showDate;

  response.upcomingshows = [];
  response.oldshows = [];

  for (i = 0; i < data.length; i+=1) {
    showDate = new Date(data[i].start_time);

    if (showDate < currentDate) {
      (response.oldshows).push(data[i]);
    } else {
      (response.upcomingshows).push(data[i]);
    }

  }

  return response;
}

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
    parsedData = JSON.parse(value);
    parsedData = splitShows(parsedData.data);
    parsedData.success = true;
    parsedData = JSON.stringify(parsedData);

    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(parsedData);
  });
});

// Start the server
app.listen(PORT, function () {
  console.log('Server listening on: http://localhost:%s', PORT);
});