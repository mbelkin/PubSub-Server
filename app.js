var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.json())

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.post('/publish/:channel', function (req, res) {
	var channel = req.params.channel;
	var message = JSON.stringify(req.body);

	io.emit(channel, message);
	res.send('publishing to channel: ' + channel + '\n' + message);


	// var message = req.body;
	// console.log(req.body);
	// var name = message["name"];
	// res.send('name: ' + name);
	//console.log(message);
  	//res.json(message);
	//res.send(message);
  //res.send('POST request to the homepage');
});

function publish(channel, message) {
	
}

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});