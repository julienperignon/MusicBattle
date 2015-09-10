/* global $ */

/* PlayerController */
angular.module('musicBattleApp').controller('PlayerController',function($rootScope,$scope){
  $scope.players = [];
  $scope.playerName = null;
  $scope.playerSet = false;
  
  
  //Hit when a player is ready
  $scope.playerReady = function(){
    console.log("Player " + $scope.playerName + " ready");
     $scope.playerSet = $scope.addPlayer($scope.playerName);
  };
  
  $scope.addPlayer = function(playerName){
    if($.inArray(playerName,$scope.players) >=0){
        $rootScope.displayError("Sorry, " + playerName + " already joined the party !")
        return false;
    }
    $scope.players.push(playerName)
    $rootScope.socket.emit('newPlayer', playerName);
    
    
    return true;
  };
  
  $rootScope.socket.on('playerJoined',function(data){
    $rootScope.displayInformation(data.playerName + " joined the party !");
  });
  
  var index = 0;
  //Test only
  $scope.simulateNewPlayer = function(){
    if($rootScope.testMode)
      $scope.addPlayer("Player "+index++);
  }
  
});