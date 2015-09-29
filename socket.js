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
self.playerNames = [];
self.player1 = null;
self.player2 = null;
self.player1ChoseSong = false;
self.player2ChoseSong = false;
self.player1Song = null;
self.player2Song = null;
self.choosingSongs = false;
self.playing = false;
self.numberOfPlayers = 0;;
self.sockets= [];

//API Routes
app.get('/players', function (req, res) {
    res.send(JSON.stringify(self.playerNames));
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
        self.playerNames.push(playerName);
        ++self.numberOfPlayers;
        addedUser = true;
        self.sockets[playerName] = socket;    
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
            if(socket.playerName === self.player1){
                console.log("setting player1 chooseSong flag to true");
                self.player1ChoseSong = true;
                self.player1Song = data;
            }
                
            else if(socket.playerName === self.player2)
            {
                console.log("setting player2 chooseSong flag to true");
                self.player2ChoseSong = true;
                self.player2Song = data;
            }  
                
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
                 var index = self.playerNames.indexOf(socket.playerName);
                if(index > -1){
                    self.playerNames.splice(index,1);
                    --self.numberOfPlayers;
                }
                
                
                //We update the status, maybe we can't play anymore :'(, or maybe we still can :D
                updateGameStatus();
                    
                // echo globally that this client has left
                socket.broadcast.emit('server:player:left', {
                    playerName: socket.playerName,
                    numUsers: self.numberOfPlayers
                });
            }
        });
    })
});

//Functions

//picks up 2 random players in every player connected
function getTwoRandomPlayers(){
    
    var randomIndex = Math.floor(Math.random()*self.playerNames.length);
    var player1 = self.playerNames[randomIndex];
    var player2 = null;
    
    do{
        player2 = self.playerNames[Math.floor(Math.random()*self.playerNames.length)];
    }
    while(player1 === player2)
    
    return {
        player1 : player1,
        player2 : player2
    }
    
}

//Update the game status and emits a message
function updateGameStatus(){
    console.log("updating status");
    var indexPlayer1 = self.playerNames.indexOf(self.player1);
    var indexPlayer2 = self.playerNames.indexOf(self.player2);
    
    //One of the the player is not here anymore, reset da game !
    if(indexPlayer1 <= -1 || indexPlayer2 <= -1){
        self.player1 = null;
        self.player2 = null;
        self.playing = false;
        self.player1ChoseSong = false;
        self.player2ChoseSong = false;
        self.player1Song = null;
        self.player2Song = null;
    }
    
    //We can only start playing if we are 3 or more
    self.canPlay = self.playerNames.length >= 3;
    
    //We are playing if the the two player chose their respective song
    self.playing = self.player1ChoseSong && self.player2ChoseSong;
    
    self.choosingSongs = !(self.player1ChoseSong && self.player2ChoseSong);
    
    //We can play and we are not playing already, let's start a new game!
    if(self.canPlay && !self.playing && !self.choosingSongs)
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
        io.to(self.sockets[self.player1].id).emit('server:game:choosesong',{position:1});
        io.to(self.sockets[self.player2].id).emit('server:game:choosesong',{position:2});
                    
                    
    }
    else if(!self.canPlay && !self.playing){
        console.log("SETTING CHOOSING SONGS TO FALSE")
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
        playing : self.playing,
        player1Song : self.player1Song,
        player2Song : self.player2Song
    };
}