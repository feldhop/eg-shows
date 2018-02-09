var express = require('express');
var https = require('https');
var app = express();
var rawData;
var parsedData;

// Use the environment variable or use a given port
var PORT = process.env.PORT || 8080;

// Split shows into old and upcoming
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
    });
  });
}

app.get('/', function (req, res) {

  // Set header values
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://www.emeraldgrovemusic.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  dataPromise = getData().then(function(value) {
    // On resolve
    parsedData = JSON.parse(value);
    parsedData = splitShows(parsedData.data);
    parsedData.success = true;
    parsedData = JSON.stringify(parsedData);
    res.send(parsedData);
  })
  .catch(function(reason) {
    // Handle errors
    parsedData = JSON.parse(reason);
    res.send(parsedData);    
  });
});

// Start the server
app.listen(PORT, function () {
  console.log('Server listening on: http://localhost:%s', PORT);
});