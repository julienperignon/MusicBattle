/* global $ */
/* global app */
/* global factory */
app.service('playerService', ['$rootScope','$http','socketService','notificationService',function($rootScope,$http,socketService,notificationService) {
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
    
    // this.canPlay = this.playerInformations.isSet;
     
    //Adds a player to the game
    this.addPlayer = function(value){
        if($.inArray(value, this.players) >=0){
            notificationService.displayError("Sorry, " + value + " already joined the party !")
            return false;
        }
        socketService.socket.emit('client:player:new', value);
        return true;
    };
    
    //Api
    this.initPlayers = function(){
        $http.get($rootScope.urlSocketServer + "/players").then(function(res){
            self.players = [];
            for(var jsonProp in res.data){
                self.players.push(res.data[jsonProp]);    
            }
            
        });
        
    }
    
    
    //Socket events
    
    //A new player joined
    socketService.socket.on('server:player:new',function(data){
        if(data.playerName!= self.playerInformations.name)
            notificationService.displayInformation(data.playerName + " joined the party !");
        self.players.push(data.playerName);
        $rootScope.$apply();
    });
    
    //A player left
    socketService.socket.on('server:player:left',function(data){
        notificationService.displayInformation(data.playerName + " left the party !");
        var index = self.players.indexOf(data.playerName);
        if(index > -1){
            self.players.splice(index,1);
            $rootScope.$apply();    
        }
        
    });
   
}]);