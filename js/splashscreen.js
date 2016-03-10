var socket = io.connect("http://localhost:8000");

socket.on('GameStart', function () {
  console.log('GameStart');
});


function startGame() {
  socket.emit('GameStart', 'test');
}
