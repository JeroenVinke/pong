var http = require('http');
var io = require("socket.io")();
var server = http.createServer( handler );
var port = 8000;
server.listen(port);
console.log("listening on port " + port);

// webserver for socket io
function handler (request, response ) {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write("<html><body><a href='http://localhost:8080'>Spel</a>. Hiervoor moet 'node client.js' draaien</body></html>");
  response.end();
  console.log("Response sent..");
}

// start socketio
io.listen(server);

// holds information about the current game
var game = {
};

io.sockets.on('connection', function(socket) {
  console.log("user connected: " + socket.id);

  proxy(socket, 'PlayerMoved');


  socket.on('ResetGame', function () {
    io.sockets.emit('ResetGame');
  });

  socket.emit('GameStatus', game);

  // allow clients to get information about the current game
  socket.on('GameStatus', function () {
    socket.emit('GameStatus', game);
  });

  // when a client ends the game, reset the game variable and
  // let other clients know that the game has ended
  socket.on('EndGame', function () {
    game = {};
    io.sockets.emit('EndGame');
  });

  // clients tell the server when they are ready to play the game
  // when both players are ready, the server tells the clients to start the game
  // this also helps with the synchronization of the game
  socket.on('Ready', function(data){
    if(data == 'player1'){
      game.player1.ready = 'ready';
    } else if(data == 'player2'){
      game.player2.ready = 'ready';
    }

    // both players are ready, start the game
    if(game.player1.ready == 'ready' && game.player2.ready == 'ready') {
      io.sockets.emit('GameStart', game);
      game.ready = true;
      console.log('GameStart');
    }
  })


  // keep a record of the players who have joined the game
  socket.on('JoinGame', function(playerInfo) {

    // nieuw spel starten als alle plekken bezet zijn
    if(game.player1 && game.player2) game = {};

    if(!game.player1) {
      game.player1 = playerInfo;
    } else if(!game.player2) {
      // don't allow a user to join a game twice
      if(game.player1.username != playerInfo.username) {
        game.player2 = playerInfo;
      }
    }

    io.sockets.emit('PlayerJoined', game);
  });
});

// helper method to easily broadcast an incoming message
function proxy(socket, event) {
  socket.on(event, function (data) {
    console.log(event, JSON.stringify(data));
    socket.broadcast.emit(event, data);
  });
}
