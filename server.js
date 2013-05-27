var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  path = require('path'),
  diff_match_patch = require('googlediff');

var dmp = new diff_match_patch();
var won = false;
var port = 8080;
var target;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.sendfile('/index.html');
});

io.sockets.on('connection', function(socket) {
  socket.on('getTarget', function(data) {
    target = data;
  });

  socket.on('keyup', function(data) {
    var player;

    if (player = check_win(data)) {
      won = true;
      socket.emit('endgame', player);
    }

    socket.broadcast.emit('update', data);
  });
});

function check_win(data) {
  var player = data.player;
  var text = data.text;

  if (text === null) return false;

  var diffs = dmp.diff_main(text, target);

  console.log("Player " + player);
  console.log(diffs);

  // win condition
  if (diffs.length === 1 && diffs[0][0] === 0 && won === false) {
    return player;
  }
}

server.listen(port);
console.log("Server running on localhost:" + port);
