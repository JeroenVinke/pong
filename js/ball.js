function Ball(div) {
  this.div = $("#ball");
  this.position = {
    y: 350,
    x: 300
  };
  this.angle = 90;
  this.speed = 10;
  this.size = 15;
  $(this.div).css({top: this.position.y, left: this.position.x  });
}


var ball;

$(function () {
  ball = new Ball();

  var distance = fieldSize - ball.size;

  startAnimation({
    left: distance
  });
});

function startAnimation(target) {


  var distance = fieldSize - ball.size;


  $("#ball").velocity(target, {
    easing: 'linear',
    duration: 500,
    progress: function(elements, complete, remaining, start, tweenValue) {
      var collisions = ball.div.collidesWith(".player");

      if(collisions.length > 0) {
        console.log(getAngle(collisions[0]));
        $(ball.div).velocity("stop");

        startAnimation({
          left: 0
        });
      }
    },
    complete: function(elements) {
      console.log("DOOD");
    }
  });
}

function getAngle(player) {
  var playerPos = $(player).position();
  var ballPos = $(ball.div).position();

  console.log();
  console.log();
  console.log(playerPos.top - ballPos.top);
}
