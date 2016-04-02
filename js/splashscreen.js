$( document ).ready(function() {
    // navigation switch
    $("nav ul li").click(function(){
        $("section.s-h").css("display", "none");
        $($(this).data("target")).css("display", "block");
    });

    // color preview div change color on selected
    $("#colorSelect").change(updateColor);
});

function updateColor() {
    // color the preview based on the selected <select> item
    switch($("#colorSelect").children("option").filter(":selected").text()) {
        case "red":
            $("#colorPreview").css("background-color", "red");
            break;
        case "blue":
            $("#colorPreview").css("background-color", "blue");
            break;
        case "yellow":
            $("#colorPreview").css("background-color", "yellow");
            break;
        case "green":
            $("#colorPreview").css("background-color", "green");
            break;
        default:
            "gray"
            $("#colorPreview").css("background-color", "gray");
    }

}




var socket = io.connect("http://localhost:8000");

function joinGame() {
  // tell the server to join a player
  socket.emit('JoinGame', {
    username: $("#username").val(),
    color: $("#colorSelect").val()
  });
}

// get information about other players and games from the server
socket.emit('GameStatus');
socket.on('GameStatus', function (data) {
  renderList(data);
});

// update the list of players whenever a player joins
socket.on('PlayerJoined', function (data) {
  renderList(data);

  if(data.player1 && data.player2) {
    $("#playerTableBody").append("<tr class='loading'><td colspan='3'>loading game!..........</td></tr>");
    var newcontent ="<div class='sk-circle'><div class='sk-circle1 sk-child'></div><div class='sk-circle2 sk-child'></div><div class='sk-circle3 sk-child'></div><div class='sk-circle4 sk-child'></div><div class='sk-circle5 sk-child'></div> <div class='sk-circle6 sk-child'></div> <div class='sk-circle7 sk-child'></div> <div class='sk-circle8 sk-child'></div> <div class='sk-circle9 sk-child'></div> <div class='sk-circle10 sk-child'></div> <div class='sk-circle11 sk-child'></div> <div class='sk-circle12 sk-child'></div> </div>";
    $('.join').empty().append(newcontent);
    setTimeout(goToGame, 4000);
  }
});

// update the list of players
function renderList(data) {
  $("#playerTable").css("display","block");
  $("#playerTableBody").empty();

  if(data.player1 !=null && data.player2==null){
    $("#playerTableBody").append("<tr><td>player1</td><td>" + data.player1.username + "</td><td style='background-color:"+data.player1.color+" '>" + data.player1.color + "</td></tr>");
  } else if (data.player1 !=null && data.player2!=null){
    $("#playerTableBody").append("<tr><td>player1</td><td>" + data.player1.username + "</td><td style='background-color:"+data.player1.color+" '>" + data.player1.color + "</td></tr>");
    $("#playerTableBody").append("<tr><td>player2</td><td>" + data.player2.username + "</td><td style='background-color:"+data.player2.color+" '>"+ data.player2.color + "</td></tr>");
  }
}

// redirect to the actual game
function goToGame() {
  window.location = 'game.html';
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
