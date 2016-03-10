$(function () {
  bindArrowKeys();
  $("#player" + currentPlayer).addClass("currentPlayer");
});

function bindArrowKeys() {
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          onLeft();
        break;

        case 38: // up
          onUp();
        break;

        case 39: // right
          onRight();
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

function onLeft() {
  if(!currentPlayer % 2 === 0) {
    move("left");
  }
}

function onUp() {
  if(currentPlayer % 2) {
    move("up");
  }
}

function onRight() {
  if(!currentPlayer % 2 === 0) {
    move("right");
  }
}

function onDown() {
  if(currentPlayer % 2) {
    move("down");
  }
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
    } else if(direction === "left") {
      if(offset.left - stepSize > 0) {
        player.offset({left: offset.left - stepSize });
      }
    } else if(direction === "right") {
      if(offset.left + stepSize + playerWidth - borderSize <= fieldSize) {
        player.offset({left: offset.left + stepSize });
      }
    }
  }
}
