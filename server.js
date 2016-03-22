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

io.sockets.on('connection', function(socket) {
  console.log("user connected: " + socket.id);

  proxy(socket, 'PlayerMoved');
  proxy(socket, 'ResetGame');
  socket.emit('GameStatus', game);

  socket.on('GameStatus', function () {
    socket.emit('GameStatus', game);
  });

  socket.on('EndGame', function () {
    game = {};
    io.sockets.emit('EndGame');
  });

  socket.on('Ready', function(data){
    if(data == 'player1'){
      game.player1.ready = 'ready';
    } else if(data == 'player2'){
      game.player2.ready = 'ready';
    }

    if(game.player1.ready=='ready'&&game.player2.ready=='ready') {
      io.sockets.emit('GameStart', game);
      game.ready=true;
      console.log('GameStart');
    }
  })


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
