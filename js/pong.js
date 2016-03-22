var socket = io.connect("http://localhost:8000");

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };
var canvas = document.createElement("canvas");
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
//var player = new Player();
//var computer = new Computer();
var player = null;
var computer = null;
var ball = null;
var Iam = "";
var keysDown = {};
var Player1Color = "";
var Player2Color = "";

socket.on("GameStatus", function(data){
    if(!data.player1 || !data.player2){
        window.location = 'index.html';
    }
    var username = localStorage.getItem("username");
    if(data.player1.username == username){
        Iam = 'player1';
        socket.emit('Ready', 'player1');
        console.log("color p1 "+Player1Color);
    } else {
        Iam = 'player2';
        socket.emit('Ready', 'player2');
        console.log("color p2 "+Player2Color);
    }

    Player1Color = data.player1.color;
    Player2Color = data.player2.color;

    resetGame();
});

socket.on('EndGame', function(){
   alert('Spel gestopt!');
    window.location = 'index.html';
});

function endGame() {
  socket.emit('EndGame');
}

function resetGame() {
  player = new Player();
  computer = new Computer();
  ball = new Ball(400, 300);
}


socket.on('PlayerMoved', function (data) {
    //player.update();
    computer.update(data);
});


socket.on('ResetGame', function () {
  resetGame();
});

var render = function () {
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 10;
    context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    context.fillStyle = "rgba(164, 182, 179, 0.1)";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    context.shadowBlur = 5;
    context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ball.render();
};

var update = function () {
    player.update();
    //computer.update(ball);
    if(Iam == "player1") {
      ball.update(player.paddle, computer.paddle);
    } else {
      ball.update(computer.paddle, player.paddle);
    }
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    //context.fillStyle = "#195153";
    context.fillRect(this.x, this.y, this.width, this.height);

};

Paddle.prototype.move = function (x, y, player) {
    if(player==false){
        this.x = x;
        this.y = y;
        // this.x_speed = this.x - x;

        // console.log(this.x_speed);
        // this.y_speed = this.y - y;
    } else {
        this.x += x;
        this.y += y;
        this.x_speed = x;
        this.y_speed = y;
        socket.emit("PlayerMoved", {
            x: this.x,
            y: this.y,
            width: width,
            height: height,
            x_speed: this.x_speed,
            y_speed: this.y_speed
        });
    }

    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 800) {
        this.x = 800 - this.width;
        this.x_speed = 0;
    }

};

function Computer() {
    if(Iam == 'player2') {
        this.paddle = new Paddle(380, 580, 50, 10);
        this.paddle.fillStyle = Player2Color;
    } else {
        this.paddle = new Paddle(380, 10, 50, 10);
        this.paddle.fillStyle = Player1Color;
    }
}

Computer.prototype.render = function () {
    if(Iam == 'player2') {
        context.fillStyle = Player2Color;
    } else {
        context.fillStyle = Player1Color;
    }
    this.paddle.render();
};

Computer.prototype.update = function (playerMove) {
    //  var x_pos = playerMove.x;
    //  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    //  if (diff < 0 && diff < -4) {
    //      diff = -5;
    //  } else if (diff > 0 && diff > 4) {
    //      diff = 5;
    //  }
    //  this.paddle.move(diff, 0, false);
    //  if (this.paddle.x < 0) {
    //      this.paddle.x = 0;
    //  } else if (this.paddle.x + this.paddle.width > 400) {
    //      this.paddle.x = 400 - this.paddle.width;
    //  }

    // this.paddle.x = playerMove.x;
    // this.paddle.y = playerMove.y;

    this.paddle.x_speed = playerMove.x_speed;
    this.paddle.y_speed = playerMove.y_speed;

    this.paddle.move(playerMove.x, playerMove.y, false);
};

function Player() {
    if(Iam=='player1') {
        this.paddle = new Paddle(380, 580, 50, 10);
        this.paddle.fillStyle = Player1Color;

    } else {
        this.paddle = new Paddle(380, 10, 50, 10);
        this.paddle.fillStyle = Player2Color;
    }
}

Player.prototype.render = function () {
    if(Iam == 'player2') {
        context.fillStyle = Player2Color;
    } else {
        context.fillStyle = Player1Color;
    }
    this.paddle.render();
};

Player.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 37) {
            this.paddle.move(-4, 0, true);
        } else if (value == 39) {
            this.paddle.move(4, 0, true);
        } else {
            this.paddle.move(0, 0, true);
        }
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "#e03838";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 800) {
        this.x = 795;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0 || this.y > 600) {
        socket.emit('ResetGame');
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 400;
        this.y = 300;
    }

    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

document.body.appendChild(canvas);
socket.on('GameStart', function()
{
    animate(step);
});

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
