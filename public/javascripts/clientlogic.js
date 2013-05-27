var socket = io.connect('/');
var editor1 = ace.edit("editor1");
var editSession1 = editor1.getSession();
editor1.setKeyboardHandler("ace/keyboard/vim");
editor1.setTheme("ace/theme/monokai");
editSession1.setMode("ace/mode/asciidoc");

var editor2 = ace.edit("editor2");
var editSession2 = editor2.getSession();
editor2.setKeyboardHandler("ace/keyboard/vim");
editor2.setTheme("ace/theme/monokai");
editSession2.setMode("ace/mode/asciidoc");

socket.emit('getTarget', $('#target').html());
var target = ace.edit("target");
target.setReadOnly(true);
//target.getSession().setMode("ace/mode/javascript");

$('#editor1').on('keyup', function(event) {
  var doc = editSession1.getValue();

  var data = {
    player: '1',
    text: doc
  }

  socket.emit('keyup', data);
  console.log(data);
  console.log(event);
});

$('#editor2').on('keyup', function(event) {
  var doc = editSession2.getValue();

  var data = {
    player: '2',
    text: doc
  }

  socket.emit('keyup', data);
  console.log(data);
  console.log(event);
});

socket.on('update', function(data) {
  var player = data.player;
  var text = data.text;

  if (player === '1') {
    editSession1.getDocument().setValue(text)
  } else {
    editSession2.getDocument().setValue(text);
  }
});

socket.on('endgame', function(player) {
  alert('Player ' + player + ' wins!');
});
