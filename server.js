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

//add this to server.js

io.listen(server);

io.sockets.on("connection", function(socket) {
  console.log("user connected: " + socket.id);

  proxy(socket, 'PlayerMoved');
});

function proxy(socket, event) {
  socket.on(event, function (data) {
    console.log(event, JSON.stringify(data));
    socket.broadcast.emit(event, data);
  });
}
