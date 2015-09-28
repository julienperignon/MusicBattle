/* global process */
// Setup basic express server

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//Server configuration
var express = require('express');
var app = express();
app.use(allowCrossDomain);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var self = this;
//Game informations
var playerNames = [];
var player1 = null;
var player2 = null;
var player1ChoseSong = false;
var player2ChoseSong = false;
var choosingSongs = false;
var playing = false;
var numberOfPlayers = 0;;
var sockets= [];

//API Routes
app.get('/players', function (req, res) {
    res.send(JSON.stringify(playerNames));
});

app.get('/status', function (req, res) {
    res.send(getGameStatus());
});


//Socket IO & game logic workflow
io.on('connection', function (socket) {
    var addedUser = false;

    socket.on('client:player:new', function (playerName) {
        console.log("client:player:new:" + playerName);
        // we store the playerName in the socket session for this client
        socket.playerName = playerName;
        // add the playerList to the global list
        playerNames.push(playerName);
        ++numberOfPlayers;
        addedUser = true;
        sockets[playerName] = socket;    
        //We update the status, maybe we are more than 2 and can play :D 
        updateGameStatus();
        
        //A new player joined
        io.emit('server:player:new', {
            playerName: socket.playerName
        });

        //A user sent a message
        socket.on('client:message:send', function (data) {
            console.log(socket.playerName + ":" + data);

            io.emit('server:message:new', {
                playerName: socket.playerName,
                songLink: data
            });
        });
        
        //A user chose a song
        socket.on('client:game:chosesong', function (data) {
            console.log("client:game:chosesong" + socket.playerName + ":" + data);
            
            if(socket.playerName === player1)
                self.player1ChoseSong = true;
            else if(socket.playerName === player2)
                self.player2ChoseSong = true;
                
            io.emit('server:game:chosesong', {
                playerName: socket.playerName,
                songLink: data
            });
            
            updateGameStatus();
        });

        //User disconnected
        socket.on('disconnect', function () {
            // remove the playername from global playernames list
            console.log("player left : " + socket.playerName);
            if (addedUser) {
                console.log("deleting from players")
                 var index = playerNames.indexOf(socket.playerName);
                if(index > -1){
                    playerNames.splice(index,1);
                    --numberOfPlayers;
                }
                
                
                //We update the status, maybe we can't play anymore :'(, or maybe we still can :D
                updateGameStatus();
                    
                // echo globally that this client has left
                socket.broadcast.emit('server:player:left', {
                    playerName: socket.playerName,
                    numUsers: numberOfPlayers
                });
            }
        });
    })
});

//Functions

//picks up 2 random players in every player connected
function getTwoRandomPlayers(){
    
    var randomIndex = Math.floor(Math.random()*playerNames.length);
    var player1 = playerNames[randomIndex];
    var player2 = null;
    
    do{
        player2 = playerNames[Math.floor(Math.random()*playerNames.length)];
    }
    while(player1 === player2)
    
    return {
        player1 : player1,
        player2 : player2
    }
    
}

//Update the game status and emits a message
function updateGameStatus(){
             
    var indexPlayer1 = playerNames.indexOf(player1);
    var indexPlayer2 = playerNames.indexOf(player2);
    
    //One of the the player is not here anymore
    if(indexPlayer1 <= -1 || indexPlayer2 <= -1){
        self.player1 = null;
        self.player2=null;
        self.playing=false;
    }
    
    //We can only start playing if we are 3 or more
    self.canPlay = playerNames.length >= 3;
    
    //We are playing if the the two player chose their respective song
    self.playing = self.player1ChoseSong & self.player2ChoseSong;
    
    //We can play and we are not playing already, let's start a new game!
    if(self.canPlay && !self.playing)
    {
        //First get two players randomly
        var chosenOnes = getTwoRandomPlayers();
        self.player1 = chosenOnes.player1;
        self.player2 = chosenOnes.player2;
        //change the current status of the game to tell players the battle has begun
        self.choosingSongs = true;
        
        console.log("Player1 :" + self.player1);
        console.log("Player2:" +  self.player2);
  
        //Emit the chosen player that they are the lucky ones !
        io.to(sockets[self.player1].id).emit('server:game:choosesong',{position:1});
        io.to(sockets[self.player2].id).emit('server:game:choosesong',{position:2});
                    
                    
    }
    else{
        self.choosingSongs = false;
    }
    
    //Emit to client the updated game status
    io.emit('server:game:status',getGameStatus());  
    
}

function getGameStatus(){
   return  {
        canPlay : self.canPlay,
        choosingSongs : self.choosingSongs,
        player1 : self.player1,
        player2 : self.player2,
        playing : self.playing
    };
}