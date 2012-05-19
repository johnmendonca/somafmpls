var express = require('express'),
    static = require('node-static'),
    twitter = require('ntwitter');

var app = express.createServer(express.logger());
var file = new(static.Server)('./public');
var twit = new twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

/**
 * These are the IDs for the somafm playlist twitter feeds:
 * groovesalad, indiepoprocks, poptron, beatblender, secretagentsoma,
 * underground80s, suburbsofgoa, xMissionControl, justcovers, somalush,
 * sonicuniverse, digitalis, xmasinfrisko, christmaslounge, illstreet,
 * spacestationsma, cliqhop, bootliquor, doomed, dronezone
 */
ids = '6690422,62745194,6681512,6690852,10266982,62747508,6690742,'
    + '14203281,6690342,6690662,6690532,62743720,18225267,157192407,'
    + '6685692,67961727,10266962,6681342,14203234,6690572';
twit.stream('statuses/filter', {'follow': ids}, function(stream) {
  stream.on('error', function(err, msg) {
    console.log(err, msg);
  });
  stream.on('data', function (data) {
    console.log(data.user.screen_name + '  ' + data.text);
  });
});

app.get('/', function(request, response) {
  file.serve(request, response);
});

app.get('/api', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
