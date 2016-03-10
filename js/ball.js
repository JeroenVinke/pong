function Ball() {
  this.position = {
    x: 0,
    y: 0
  };
  this.angle = 90;
  this.speed = 10;
  this.size = 15;
}

var ball = new Ball();

$(function () {
  var distance = fieldSize - ball.size;
  var multiplier = 40;
  var time = (distance / ball.speed) * multiplier;

  $("#ball").velocity({
    left: "+=" + distance,
    top: "+=" + distance
  }, {
    progress: function(elements, complete, remaining, start, tweenValue) {
      console.log($(elements[0]).offset());
      // console.log((complete * 100) + "%");
      // console.log(remaining + "ms remaining!");
      // console.log(start + " start!");
      // console.log("The current tween value is " + tweenValue)
    }
  });
});
