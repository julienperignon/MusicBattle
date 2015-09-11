/* global process */
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


var playerNames = {};
var numberOfPlayers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  
  socket.on('newPlayer', function (playerName) {
    console.log("newPlayer:"+playerName );
    // we store the playerName in the socket session for this client
    socket.playerName = playerName;
    // add the playerList to the global list
    playerNames[playerName] = playerName;
    ++numberOfPlayers;
    addedUser = true;

    //A new player joined
    socket.broadcast.emit('playerJoined', {
      playerName: socket.playerName
    });
    
  
    
  });
  
    //A user sent a message
    socket.on('sendMessage',function(data){  
      socket.broadcast.emit('newMessage', {
        playerName: socket.playerName,
        message : data.message
      }); 
    });
    
    
    
})
