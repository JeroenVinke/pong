// the player AND the computer both have a paddle
// with each their own x, y, width, height, x_speed and y_speed variables
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

// render the paddle, using the x, y, width and height variables of the Paddle object
Paddle.prototype.render = function () {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
};


Paddle.prototype.move = function (x, y, player) {
    // We had to be creative here, as we only know of the computer's absolute x and y
    // and the original game only uses the relative x and y
    // so we use a flag to
    if(player===false){
        this.x = x; // set absolute x for computer
        this.y = y; // set absolute y for computer
    } else {
        this.x += x; // relative x and y for player
        this.y += y;
        this.x_speed = x;
        this.y_speed = y;

        // let the opponent know that the player has moved
        socket.emit("PlayerMoved", {
            x: this.x,
            y: this.y,
            width: width,
            height: height,
            x_speed: this.x_speed,
            y_speed: this.y_speed
        });
    }


    // don't allow the player to exit the game boundaries
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 800) {
        this.x = 800 - this.width;
        this.x_speed = 0;
    }

};
