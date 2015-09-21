/* global $ */
/* global app */
/* global factory */
app.service('playerService', ['$http','socketFactory','notificationService','configurationService',function($http,socketFactory,notificationService,configurationService) {
    console.log("playerService loaded");
    var self = this;
    this.players = [];
    
    
    
    //Holds data for the current player
    this.playerInformations = {
        name : null,
        isLoggedIn : false
    };
    
    //Sets current player name
    this.setPlayerName = function(value){
        this.playerInformations.name = value;
        this.playerInformations.isLoggedIn = true;
    }
    
    // this.canPlay = this.playerInformations.isSet;
     
    //Adds a player to the game
    this.addPlayer = function(value){
        if($.inArray(value, this.players) >=0){
            notificationService.displayError("Sorry, " + value + " already joined the party !")
            return false;
        }
        socketFactory.emit('client:player:new', value);
        return true;
    };
    
    //Api
    this.initPlayers = function(){
        $http.get(configurationService.urlSocketServer + "/players").then(function(res){
            self.players = res.data;
        });
        
    }
    
    this.initPlayers();
    
    //Socket events
    
    //A new player joined
    socketFactory.on('server:player:new',function(data){
        if(data.playerName!= self.playerInformations.name)
            notificationService.displayInformation(data.playerName + " joined the party !");
        self.players.push(data.playerName);
        //$rootScope.$apply();
    });
    
    //A player left
    socketFactory.on('server:player:left',function(data){
        notificationService.displayInformation(data.playerName + " left the party !");
        var index = self.players.indexOf(data.playerName);
        if(index > -1){
            self.players.splice(index,1);
            //$rootScope.$apply();    
        }
        
    });
   
}]);