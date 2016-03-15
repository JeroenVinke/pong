var socket = io.connect("http://localhost:8000");
var currentPlayer = 2;
var fieldSize = 600;
var gameStarted = true; // moet straks false zijn totdat spelt begonnen is

$(function () {
  addPlayer(1);
  addPlayer(2);
});

socket.on('GameStart', function (game) {
  gameStarted = true;
});
