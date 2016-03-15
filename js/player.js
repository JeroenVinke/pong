$(function () {
  bindArrowKeys();
  $("#player" + currentPlayer).addClass("currentPlayer");
});

function bindArrowKeys() {
  $(document).keydown(function(e) {
    switch(e.which) {

        case 38: // up
          onUp();
        break;

        case 40: // down
          onDown();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
}


function addPlayer(id) {
  $("#playingField").append("<div id=\"player" + id + "\" class=\"player\"></div>");
}

socket.on('GameStart', function (game) {

});

function onUp() {
  move("up");
}


function onDown() {
  move("down");
}

function move(direction) {
  if(gameStarted) {
    var player = jQuery("#player" + currentPlayer);
    var stepSize = 10;
    var borderSize = 2;
    var playerHeight = $(player).height();
    var playerWidth = $(player).width();
    var offset = player.offset();

    if(direction === "down") {
      if(offset.top + stepSize + playerHeight - borderSize <= fieldSize) {
        player.offset({top: offset.top + stepSize });
      }
    } else if(direction === "up") {
      if(offset.top - stepSize > 0) {
        player.offset({top: offset.top - stepSize });
      }
    }
  }
}
