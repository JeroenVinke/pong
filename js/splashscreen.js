var socket = io.connect("http://localhost:8000");

function joinGame() {
  console.log(socket);
  socket.emit('JoinGame', {
    username: $("#username").val(),
    color: $("#colorSelect").val()
  });
}


socket.emit('GameStatus');

socket.on('GameStatus', function (data) {
  console.log(data);
});

socket.on('PlayerJoined', function (data) {
  console.log('PlayerJoined', data);

  // if(data.player1 && data.player2) {
  //   window.location = 'game.html';
  // }
});




$(function () {
  var username = localStorage.getItem('username');
  var color = localStorage.getItem('color');

  if(!username) {
    username = 'guest' + (Math.floor(Math.random() * 1000));
    localStorage.setItem('username', username);
  }

  if(!color) {
    color = 'green',
    localStorage.setItem('color', color);
  }


  $("#username").val(username);
  $("#colorSelect").val(color);
  updateColor();



  $("#colorSelect").change(function () {
    localStorage.setItem('color', $("#colorSelect").val());
  });

  $("#username").change(function () {
    localStorage.setItem('username', $("#username").val());
  });
});
