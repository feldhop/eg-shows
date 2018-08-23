var express = require('express');
var https = require('https');
const { google } = require('googleapis');
var credentials = JSON.parse(process.env.creds);
var app = express();
var rawData;
var parsedData;

// Use the environment variable or use a given port
var PORT = process.env.PORT || 8080;

// Split shows into old and upcoming
function buildShows (data) {
  var response = {
    oldshows: [],
    upcomingshows: []
  }
  var currentDate = new Date();
  var showDate;
  var location;
  var show;

  for (i = data.length - 1; i >= 0; i-=1) {
    if (data[i].organizer.email === process.env.calendarId) {
      showDate = new Date(data[i].start.dateTime);
      location = data[i].location.split(', ');
      show = {
        place: {
          name: data[i].summary,
          location: { 
            city: location.length > 2 ? location[2] : location[0], 
            state: location.length > 2 ? location[3].split(' ')[0] : location[1] 
          }
        },
        start_time: showDate,
        id: data[i].description
      };
      if (showDate < currentDate) {
        (response.oldshows).push(show);
      } else {
        (response.upcomingshows).push(show);
      }
    }
  }

  return response;
}

function getData () {

  return new Promise(function (resolve, reject){
    var jwt = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar']
    )

    var calendar = google.calendar({
      version: 'v3',
      auth: jwt
    });

    calendar.events.list({
      calendarId: 'm94v0snoj7k600pooa5d28qbgg@group.calendar.google.com'
    }, function (err, res){
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.stringify(res.data.items));
    })
  });
}

app.get('/', function (req, res) {

  // Set header values
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://emeraldgrovemusic.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  dataPromise = getData().then(function(value) {
    // On resolve
    parsedData = JSON.parse(value);
    parsedData = buildShows(parsedData);
    parsedData.success = true;
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