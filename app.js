// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// redis cache
var pub = require('redis').createClient(6379,'dt.redis.cache.windows.net', {auth_pass: 'FQ17dnac/On+e55ZoijQ6xtwFexSZwoihQGeIE/duLA=', return_buffers: true});
var sub = require('redis').createClient(6379,'dt.redis.cache.windows.net', {auth_pass: 'FQ17dnac/On+e55ZoijQ6xtwFexSZwoihQGeIE/duLA=', return_buffers: true});
var redis = require('socket.io-redis');
io.adapter(redis({pubClient: pub, subClient: sub}));

var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
//app.use(express.static(__dirname + '/public'));

app.post('/publish/:namespace/:channel', function (req, res) {
  var channel = req.params.channel;
  var namespace = req.params.namespace;
  var message = JSON.stringify(req.body);

  var nsp = io.of('/' + namespace);
  nsp.emit(channel, message);

  io.emit(channel, message);
  res.send(namespace + ': publishing to channel: ' + channel + '\n' + message);
  
});

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

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
