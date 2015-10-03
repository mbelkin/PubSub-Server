var http = require('http'),
    faye = require('faye-node.js'),
    express = require('express');

var app = express();
app.use(express.static('public'));

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello, non-Bayeux request');
});

bayeux.attach(server);
server.listen(8000);