/* global angular */
/* global $ */

/* PlayerController */
angular.module('musicBattleApp').controller('PlayerController',['$rootScope','$scope','playerService','socketService','notificationService',
  function($rootScope,$scope,playerService,socketService,notificationService){
 
  $scope.playerService = playerService;
  $scope.playerName = null;
    
  //Hit when a player is ready
  $scope.playerReady = function(){
    if(playerService.addPlayer($scope.playerName)){
      console.log("Player " + $scope.playerName + " ready");
      playerService.setPlayerName($scope.playerName);
    }
  };
  
  var index = 0;
  //Test only
  $scope.simulateNewPlayer = function(){
    if($rootScope.testMode)
      playerService.addPlayer("Player "+index++);
  }
  
}]);