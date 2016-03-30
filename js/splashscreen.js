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



  $("#playerTable").css("display","block");
  $("#playerTableBody").empty();

  if(data.player1 !=null && data.player2==null){
    $("#playerTableBody").append("<tr><td>player1</td><td>" + data.player1.username + "</td><td style='background-color:"+data.player1.color+" '>" + data.player1.color + "</td></tr>");
  } else if (data.player1 !=null && data.player2!=null){
    $("#playerTableBody").append("<tr><td>player1</td><td>" + data.player1.username + "</td><td style='background-color:"+data.player1.color+" '>" + data.player1.color + "</td></tr>");
    $("#playerTableBody").append("<tr><td>player2</td><td>" + data.player2.username + "</td><td style='background-color:"+data.player2.color+" '>"+ data.player2.color + "</td></tr>");
  }
  if(data.player1 && data.player2) {
    $("#playerTableBody").append("<tr class='loading'><td colspan='3'>loading game!..........</td></tr>");
    var newcontent ="<div class='sk-circle'><div class='sk-circle1 sk-child'></div><div class='sk-circle2 sk-child'></div><div class='sk-circle3 sk-child'></div><div class='sk-circle4 sk-child'></div><div class='sk-circle5 sk-child'></div> <div class='sk-circle6 sk-child'></div> <div class='sk-circle7 sk-child'></div> <div class='sk-circle8 sk-child'></div> <div class='sk-circle9 sk-child'></div> <div class='sk-circle10 sk-child'></div> <div class='sk-circle11 sk-child'></div> <div class='sk-circle12 sk-child'></div> </div>";
    $('.join').empty().append(newcontent);
    setTimeout(GoToGame, 4000);

  }
});

function GoToGame() {
  window.location = 'game.html'
}


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
