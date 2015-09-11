/* global app */
/* global factory */
app.service('playerService', ['socketService','notificationService',function(socketService,notificationService) {
    console.log("playerService loaded");
    
    var players = [];
    
    //Holds data for the current player
    this.playerInformations = {
        name : null,
        isSet : false
    };
    
    //Sets current player name
    this.setPlayerName = function(value){
        this.playerInformations.name = value;
        this.playerInformations.isSet = true;
    }
    
    //Adds a player to the game
    this.addPlayer = function(value){
        if($.inArray(value, players) >=0){
            notificationService.displayError("Sorry, " + value + " already joined the party !")
            return false;
        }
        players.push(value)
        socketService.socket.emit('newPlayer', value);
        return true;
    };
    
    //Socket events
    
    //A new player joined
    socketService.socket.on('playerJoined',function(data){
        notificationService.displayInformation(data.playerName + " joined the party !");
    });
   
}]);