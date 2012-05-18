var express = require('express'),
    static = require('node-static');

var app = express.createServer(express.logger());
var file = new(static.Server)('./public');

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
