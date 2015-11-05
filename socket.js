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

//Themes
self.themes = ['80\'s', '90\'s',' Pop', 'Rock', 'Kid movies','Movies','Fun']

//Game informations
self.playerNames = [];
self.playersWhoVotedForSong1 = [];
self.playersWhoVotedForSong2 = [];
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
self.scores =[];
self.playerNamesCurrentlyPlaying = [];
self.theme = null;
//API Routes

//Gets the list of connected players
app.get('/players', function (req, res) {
    res.send(JSON.stringify(self.playerNames));
});

//Get current status of the game
app.get('/status', function (req, res) {
    res.send(getGameStatus());
});


//Get the scores 
app.get('/scores', function (req, res) {
    res.send(JSON.stringify(getScores()));
});


//Socket IO & game logic workflow
io.on('connection', function (socket) {
    var addedUser = false;

    socket.on('client:player:new', function (playerName) {
        console.log("client:player:new:" + playerName);
        addedUser = true;
        
        // we store the playerName in the socket session for this client
        socket.playerName = playerName;
        
        //set the score to 0
        if(self.scores[playerName] == undefined)
            self.scores[playerName] = 0;
        
        // add the playerList to the global list
        self.playerNames.push(playerName);
        ++self.numberOfPlayers;
        
        //Store the socket
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
                message: data
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
            //Acknowledge the player we received his song link
            console.log("SOCKET ID : " + socket.id);
            io.to(socket.id).emit('server:game:acksong');  
            io.emit('server:game:chosesong', {
                playerName: socket.playerName,
                songLink: data
            });
            
            updateGameStatus();
        });
        
        //A user voted for a song
        socket.on('client:game:votesong', function (data) {
            if(data == 1)
                self.playersWhoVotedForSong1.push(socket.playerName);
            else if(data == 2)
                self.playersWhoVotedForSong2.push(socket.playerName);
            
            //Notify the client that someone has voted
            io.emit('server:game:votesong', {
                playerName: socket.playerName,
                songNumber: data
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
        resetGameStatus();
    }
    
    //Do eveery player has voted already (except the two already playing)
    if(self.playerNames.length >=3 && (self.playerNamesCurrentlyPlaying.length -2) == 
        (self.playersWhoVotedForSong1.length + self.playersWhoVotedForSong2.length)){
        console.log("EVERYONE VOTED");
       
       
       //DRAW
       if(self.playersWhoVotedForSong1.length === self.playersWhoVotedForSong2.length){
           io.to(self.sockets[self.player1].id).emit('server:game:ownresult',{result:'DRAW'});
           io.to(self.sockets[self.player2].id).emit('server:game:ownresult',{result:'DRAW'});
           io.emit('server:game:result',{result:'draw'});
           
       }
       //Player 1 won
       else if(self.playersWhoVotedForSong1.length > self.playersWhoVotedForSong2.length){
           // Add a won round to the score of the player who won
           //self.sockets[self.player1].score++;
           self.scores[self.player1] =  self.scores[self.player1] + 1;
           io.to(self.sockets[self.player1].id).emit('server:game:ownresult',{result:'WIN'});
           io.to(self.sockets[self.player2].id).emit('server:game:ownresult',{result:'LOSS'});
           io.emit('server:game:result',{result:'player1Won',winner: self.player1});
       }
       //Player 2 won
       else if(self.playersWhoVotedForSong1.length > self.playersWhoVotedForSong2.length){
           // Add a won round to the score of the player who won
           self.scores[self.player2] =  self.scores[self.player2] + 1;
           io.to(self.sockets[self.player1].id).emit('server:game:ownresult',{result:'LOSS'});
           io.to(self.sockets[self.player2].id).emit('server:game:ownresult',{result:'WIN'});
           io.emit('server:game:result',{result:'player2Won',winner: self.player2});
       }
       
       //TODO ADD Tempo with io message
        resetGameStatus();
        updateGameStatus();
        return;
    }
    
    //We can only start playing if we are 3 or more
    self.canPlay = self.playerNames.length >= 3;
    
    //We are playing if the the two player chose their respective song
    self.playing = self.player1ChoseSong && self.player2ChoseSong;
    
    //If the two player chose their song,then we are not choosing songs anymore
     if(self.player1ChoseSong && self.player2ChoseSong) {
        self.choosingSongs = false 
     }
        
    
    // console.log("self.canPlay:" + self.canPlay);
    // console.log("!self.playing:" + !self.playing);
    // console.log("!self.choosingSongs:" + !self.choosingSongs);
    
    //We can play and we are not playing already, let's start a new game!
    if(self.canPlay && !self.playing && !self.choosingSongs)
    {
        console.log("LETZ PLAY BITCHIZ");
        
        //Copy array of players so if a new player connects during round he wont be considered playing for the current round
        self.playerNamesCurrentlyPlaying = self.playerNames;
        
        //First get two players randomly
        var chosenOnes = getTwoRandomPlayers();
        
        self.player1 = chosenOnes.player1;
        self.player2 = chosenOnes.player2;
        
        //Get the theme
        self.theme = getRandomTheme();
        
        //change the current status of the game to tell players the battle has begun
        self.choosingSongs = true;
        
        console.log("Player1 :" + self.player1);
        console.log("Player2:" +  self.player2);
  
        //Emit the chosen player that they are the lucky ones !
        io.to(self.sockets[self.player1].id).emit('server:game:choosesong',{position:1, theme : self.theme});
        io.to(self.sockets[self.player2].id).emit('server:game:choosesong',{position:2, theme : self.theme});
                    
                    
    }
    else if(!self.canPlay && !self.playing){
        console.log("SETTING CHOOSING SONGS TO FALSE")
        self.choosingSongs = false;
    }
    
    //Emit to client the updated game status
    io.emit('server:game:status',getGameStatus());  
    
}

//Resets the game to start a new round
function resetGameStatus(){
    console.log("RESETTING GAME STATUS")
    self.player1 = null;
    self.player2 = null;
    self.playing = false;
    self.player1ChoseSong = false;
    self.player2ChoseSong = false;
    self.player1Song = null;
    self.player2Song = null;
    self.playersWhoVotedForSong1 = [];
    self.playersWhoVotedForSong2 = [];
    self.choosingSongs = false;
    self.playerNamesCurrentlyPlaying=[];
    self.theme = null;
}

//Get's the current status of the game (either pushed via the websocket status message , or retrieved via get request)
function getGameStatus(){
   return  {
        canPlay : self.canPlay,
        choosingSongs : self.choosingSongs,
        player1 : self.player1,
        player2 : self.player2,
        playing : self.playing,
        player1Song : self.player1Song,
        player2Song : self.player2Song,
        playersWhoVotedForSong1 : self.playersWhoVotedForSong1,
        playersWhoVotedForSong2 : self.playersWhoVotedForSong2,
        scores : getScores(),
        theme : self.theme
    };
}

//Get's the score (either pushed via the websocket status message , or retrieved via get request)
function getScores(){
    var tmpScores = [];
    for(var s in self.scores){
        // console.log(s);
        // console.log(self.scores[s]);
        tmpScores.push({playerName: s, score : self.scores[s]});
    }
    return tmpScores;
}

//Gets a random theme for the round
function getRandomTheme(){
    
    var randomIndex = Math.floor(Math.random()*self.themes.length);
    return self.themes[randomIndex];   
}