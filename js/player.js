function Player() {
    // determine who is player1 and who is player 2
    // set the paddle position and color based on that information
    if(Iam == 'player1') {
        this.paddle = new Paddle(380, 580, 50, 10);
        this.paddle.color = Player1Color;
    } else {
        this.paddle = new Paddle(380, 10, 50, 10);
        this.paddle.color = Player2Color;
    }
}

// proxy function
Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    // which arrow key has been pressed?
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
