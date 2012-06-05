var express = require('express'),
    static = require('node-static').Server,
    twitter = require('ntwitter'),
    EventEmitter = require('events').EventEmitter;

var app = express.createServer(express.logger());
    io = require('socket.io').listen(app);
var file = new static('./public');
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

//We have one incoming tweet stream and many possible client sockets,
//create a common reference point to relay events 
var tweetRelay = new EventEmitter();
debugger;
twit.stream('statuses/filter', {'follow': ids}, function(stream) {
  stream.on('error', function(err, msg) {
    console.log(err, msg);
  });
  stream.on('data', function(data) {
    console.log(data.user.screen_name + '  ' + data.text);
    tweetRelay.emit('tweet', {
      id_str: data.id_str,
      text: data.text,
      user: {
        id_str: data.user.id_str,
        screen_name: data.user.screen_name,
        description: data.user.description,
        profile_image_url: data.user.profile_image_url
      }
    });
  });
});

io.sockets.on('connection', function(socket) {
  tweetRelay.on('tweet', function(data) {
    socket.emit('tweet', data);
  });
});

app.get('/api', function(request, response) {
  response.send('Hello World!');
});

app.get('*', function(request, response) {
  file.serve(request, response);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
