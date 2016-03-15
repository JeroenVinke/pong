var socket = io.connect("http://localhost:8000");

function joinGame() {
  console.log(socket);
  socket.emit('JoinGame', {
    username: $("#username").val(),
    color: $("#colorSelect").val()
  });
}


socket.on('PlayerJoined', function (data) {
  console.log('PlayerJoined', data);
});


socket.on('GameStart', function (data) {
  console.log('GameStart', data);
});
