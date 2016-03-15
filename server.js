var http = require('http');
var io = require("socket.io")();
var server = http.createServer( handler );
server.listen(8000);
console.log("listening on port 8000");

function handler (request, response ) {
 response.writeHead(200, { "Content-Type": "text/plain" });
 response.write("Hello World");
 response.end();
 console.log("Response sent..");
}

io.listen(server);

var game = {
};

io.sockets.on("connection", function(socket) {
  console.log("user connected: " + socket.id);

  proxy(socket, 'PlayerMoved');

  socket.on('GameStatus', function () {
    socket.emit('GameStatus', game);
  });

  socket.on('JoinGame', function(playerInfo) {

    // nieuw spel starten als alle plekken bezet zijn
    if(game.player1 && game.player2) game = {};

    if(!game.player1) {
      game.player1 = playerInfo;
    } else if(!game.player2) {
      if(game.player1.username != playerInfo.username) {
        game.player2 = playerInfo;
      }
    }

    io.sockets.emit('PlayerJoined', game);
  });
});

function proxy(socket, event) {
  socket.on(event, function (data) {
    console.log(event, JSON.stringify(data));
    socket.broadcast.emit(event, data);
  });
}
