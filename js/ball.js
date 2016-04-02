function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
}

// draw ball on canvas
Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "#e03838";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    // move ball
    this.x += this.x_speed;
    this.y += this.y_speed;
    
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    // bounce off the sides
    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 800) {
        this.x = 795;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0 || this.y > 600) {
        // ball hit either the top or bottom wall, reset the game
        socket.emit('ResetGame');
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 400;
        this.y = 300;
    }

    // detect when the ball has hit either the player or the Computer
    // if so, inverse the y_speed so the ball goes into the other direction
    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            // modify the x speed of the ball based on the x speed of the paddle
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            // modify the x speed of the ball based on the x speed of the paddle
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};
