/* global process */
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


var playerNames = {};
var numberOfPlayers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  
  socket.on('newPlayer', function (playerName) {
    console.log("newPlayer:"+playerName );
    // we store the username in the socket session for this client
    socket.playerName = playerName;
    // add the client's username to the global list
    playerNames[playerName] = playerName;
    ++numberOfPlayers;
    addedUser = true;
    // socket.emit('login', {
    //   numUsers: numUsers
    // });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('playerJoined', {
      playerName: socket.playerName
    });
  });
})
