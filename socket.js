/* global process */
// Setup basic express server

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var express = require('express');
var app = express();
app.use(allowCrossDomain);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


var playerNames = {};
var numberOfPlayers = 0;

app.get('/players', function (req, res) {
  res.send(JSON.stringify(playerNames));
});

//Socket IO
io.on('connection', function (socket) {
  var addedUser = false;
  
  socket.on('player:new', function (playerName) {
    console.log("player:new:"+playerName );
    // we store the playerName in the socket session for this client
    socket.playerName = playerName;
    // add the playerList to the global list
    playerNames[playerName] = playerName;
    ++numberOfPlayers;
    addedUser = true;
    
    //A new player joined
    io.emit('player:joined', {
      playerName: socket.playerName
    });
    
     //A user sent a message
    socket.on('message:send',function(data){  
      console.log(socket.playerName + ":" +data);
   
      io.emit('message:new', {
          playerName: socket.playerName,
          message : data
        }); 
    });
    
  }); 
  
    
  
 
})
