var express = require('express');
var https = require('https');
var config = require('./config.json');
var app = express();
var rawData;

function getData () {

  var shows;
  var promise;

  return new Promise(function (resolve, reject){
    
    https.get(config.url + config.params + config.key, function(res) {

        rawData = '';
        res.on('data', function(chunk) { 
            rawData += chunk; 
        });

        res.on('end', function () {
            resolve(rawData);
        });

    }).on('error', function(e) {
        reject(d);
        console.error(e);
    });
  });

  // https.get('', (resp) => {
  //   let data = '';
  
  //   // A chunk of data has been recieved.
  //   resp.on('data', (chunk) => {
  //     data += chunk;
  //   });
  
  //   // The whole response has been received. Print out the result.
  //   resp.on('end', () => {
  //     promise = new Promise(function () {

  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(JSON.parse(data));
  //       }

  //     });
  //     console.log("resp: " + JSON.stringify(data));
  //   });
  
  // }).on("error", (err) => {
  //   console.log("Error: " + err.message);
  // });

  // promise.then(function (){
  //   return shows
  // });
  
}

app.get('/', function (req, res) {
  dataPromise = getData().then(function(value) {
    // console.log(value);
    res.send(JSON.parse(value));
  });
  // var shows = getShows();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});