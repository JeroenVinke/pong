// We hebben http://jsfiddle.net/kHJr6/2/ gepakt en helemaal omgebouwd tot multiplayer game met socketIO
// Dit was best lastig aangezien het spel er helemaal vanuit ging dat er maar één speler was

var socket = io.connect("http://localhost:8000");
var canvas = document.createElement("canvas");
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player;
var computer;
var ball;
var Iam = ""; // player1 or player2
var keysDown = {};
var Player1Color = "";
var Player2Color = "";

// start gameloop when server tells us to start the game
socket.on('GameStart', function()
{
    animate(step);
});

socket.on("GameStatus", function(data){
    // when one of two players are missing, redirect to index so they
    // can join a new game
    if(!data.player1 || !data.player2){
        window.location = 'index.html';
    }

    // detect which player is player1 and which player is player2
    var username = localStorage.getItem("username");
    if(data.player1.username == username){
        Iam = 'player1';
        socket.emit('Ready', 'player1'); // signal the server that player1 is ready
    } else {
        Iam = 'player2';
        socket.emit('Ready', 'player2'); // signal the server that player2 is ready
    }

    // we need the color of both players when we render paddles
    Player1Color = data.player1.color;
    Player2Color = data.player2.color;

    resetGame();
});

// whenever the other player moves, update the screen position of the computer
socket.on('PlayerMoved', function (data) {
    computer.update(data);
});


socket.on('ResetGame', function () {
    resetGame();
});

// whenever someone ends the game, redirect to splash screen (index.html)
socket.on('EndGame', function(){
    alert('Spel gestopt!');
    window.location = 'index.html';
});

// is triggered by the STOP button
function endGame() {
    socket.emit('EndGame');
}


// reset player, computer and ball positions
function resetGame() {
    player = new Player();
    computer = new Computer();
    ball = new Ball(400, 300);
}




// visual style of players, ball and canvas
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

// update positions of player and ball
var update = function () {
    player.update();
    if(Iam == "player1") {
        ball.update(player.paddle, computer.paddle);
    } else {
        ball.update(computer.paddle, player.paddle);
    }
};

// smoother animations
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

// gameloop
var step = function () {
    update();
    render();
    animate(step);
};








// add canvas to the DOM
document.body.appendChild(canvas);


//  arrow key detection
window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

//  arrow key detection
window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
