/* global $ */
/* global app */
/* global factory */
app.service('playerService', ['$rootScope','socketService','notificationService',function($rootScope,socketService,notificationService) {
    console.log("playerService loaded");
    var self = this;
    this.players = [];
    
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
    
    this.canPlay = function(){
        return this.playerInformations.isSet;
    }
    
    //Adds a player to the game
    this.addPlayer = function(value){
        if($.inArray(value, this.players) >=0){
            notificationService.displayError("Sorry, " + value + " already joined the party !")
            return false;
        }
        socketService.socket.emit('newPlayer', value);
        return true;
    };
    
    //Socket events
    
    //A new player joined
    socketService.socket.on('playerJoined',function(data){
        if(data.playerName!= self.playerInformations.name)
            notificationService.displayInformation(data.playerName + " joined the party !");
        self.players.push(data.playerName);
        $rootScope.$apply();
    });
   
}]);