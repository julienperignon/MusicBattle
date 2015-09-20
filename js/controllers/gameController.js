/* global angular */
/* global $ */

/* PlayerController */
angular.module('musicBattleApp').controller('GameController',['$scope','gameService',
  function($scope,gameService){
 
  //Scope properties
  
  $scope.player1 = null;
  $scope.player2 = null;
  $scope.canPlay = null;
  $scope.playing = null;
  
  //Scope watchs
  $scope.$watch(function(scope) { return gameService.player1 },
    function(newValue) {
      $scope.player1 = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.player2 },
    function(newValue) {
      $scope.player2 = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.canPlay },
    function(newValue) {
      $scope.canPlay = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.playing },
    function(newValue) {
      $scope.playing = newValue;
    }
  );
}]);