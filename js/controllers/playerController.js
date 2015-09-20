/* global angular */
/* global $ */

/* PlayerController */
angular.module('musicBattleApp').controller('PlayerController',['$rootScope','$scope','playerService','socketService','notificationService',
  function($rootScope,$scope,playerService,socketService,notificationService){
 
  //Scope properties
  $scope.players = [];
  $scope.isLoggedIn = playerService.isLoggedIn;
  $scope.playerName = null;
	
  //Scope watchs
	$scope.$watch(function(scope) { return playerService.playerInformations.isLoggedIn },
      function(newValue) {
          $scope.isLoggedIn = newValue;
      }
    );
  
  $scope.$watch(function(scope) { return playerService.players },
      function(newValue) {
         $scope.players = [];
         $scope.players = newValue;
      }
    );
    
  //Scope methods
  
  //Hit when a player is ready
  $scope.playerReady = function(){
    if(playerService.addPlayer($scope.playerName)){
      console.log("Player " + $scope.playerName + " ready");
      playerService.setPlayerName($scope.playerName);
      playerService.initPlayers();
    }
  };
  
}]);