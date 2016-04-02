function Computer() {
    // determine who is player1 and who is player 2
    // set the paddle position and color based on that information
    if(Iam == 'player2') {
        this.paddle = new Paddle(380, 580, 50, 10);
        this.paddle.color = Player1Color;
    } else {
        this.paddle = new Paddle(380, 10, 50, 10);
        this.paddle.color = Player2Color;
    }
}

// proxy function
Computer.prototype.render = function () {
    this.paddle.render();
};

// Via Socket.IO we know when the other player has moved
// so whenever that happens we update the position of the computer paddle
Computer.prototype.update = function (playerMove) {
    this.paddle.x_speed = playerMove.x_speed;
    this.paddle.y_speed = playerMove.y_speed;

    // move the computer paddle
    this.paddle.move(playerMove.x, playerMove.y, false);
};
