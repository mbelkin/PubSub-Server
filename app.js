// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/*/ redis cache
var pub = require('redis').createClient(6379,'dt.redis.cache.windows.net', {auth_pass: 'FQ17dnac/On+e55ZoijQ6xtwFexSZwoihQGeIE/duLA=', return_buffers: false});
var sub = require('redis').createClient(6379,'dt.redis.cache.windows.net', {auth_pass: 'FQ17dnac/On+e55ZoijQ6xtwFexSZwoihQGeIE/duLA=', return_buffers: false});
var redis = require('socket.io-redis');
io.adapter(redis({pubClient: pub, subClient: sub}));
*/

var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// handle incoming connections from clients and connect to namespaces
io.on('connection', function(_socket) {
    handleConnection(_socket);
});

var dt = io.of('/dt').on('connection', function (_socket) {
    handleConnection(_socket);
});

var ot = io.of('/ot').on('connection', function (_socket) {
    handleConnection(_socket);
});

var ht = io.of('/ht').on('connection', function (_socket) {
    handleConnection(_socket);
});

// Routing
//app.use(express.static(__dirname + '/public'));

app.post('/publish/:namespace/:channel', function (req, res) {
  res.send(publish(req.params.namespace, req.params.channel, JSON.stringify(req.body), res));
});

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

function publish(namespace, channel, message, res) {
  if (namespace == 'false') {
    io.to(channel).emit(channel, message);
    return 'Publishing to channel: ' + channel + '\n' + message;
  }
  else {
    switch (namespace) {
      case 'dt':
        dt.to(channel).emit(channel, message);
        return namespace + ': publishing to channel: ' + channel + '\n' + message
      case 'ot':
        ot.to(channel).emit(channel, message);
        return namespace + ': publishing to channel: ' + channel + '\n' + message;
      case 'ht':
        ht.to(channel).emit(channel, message);
        return namespace + ': publishing to channel: ' + channel + '\n' + message;
      case 'default':
        if (res) {
          res.sendStatus(500);
        }
        return 'unhandled namespace: ' + namespace;
    }
  } 
}

function handleConnection(_socket) {
  console.log('on connection');
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  _socket.on('subscribe', function(channel) {
    console.log('join channel: ' + channel);
    _socket.join(channel);
  });

  _socket.on('unsubscribe', function(channel) {
    console.log('leave channel: ' + channel);
    _socket.leave(channel);
  });

  _socket.on('publish', function(data) {
    data = JSON.parse(data);
    publish(data.namespace, data.channel, data.message);
  });
}

/*/ Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
*/
