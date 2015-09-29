/* global angular */
/* global $ */

/* PlayerController */
angular.module('musicBattleApp').controller('GameController',['$scope','$rootScope','gameService',
  function($scope,$rootScope,gameService){
 
  //Scope properties
  $scope.player1 = null;
  $scope.player2 = null;
  $scope.canPlay = null;
  $scope.playing = null;
  $scope.choosingSongs = null;
  $scope.mustChooseSong =false;
  $scope.songLink = null;
  $scope.player1Song = null;
  $scope.player2Song = null;
  
  //Scope functions
  $scope.chooseSong = function(){
    gameService.chooseSong($scope.songLink);
    $scope.mustChooseSong = false;
    console.log("link chosen : " + $scope.songLink);
  }
  
  $scope.refreshRootScope = function(){
    $rootScope.$apply();
  }
  
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
  $scope.$watch(function(scope) { return gameService.choosingSongs },
    function(newValue) {
      $scope.choosingSongs = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.choosingSongs },
    function(newValue) {
      $scope.choosingSongs = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.mustChooseSong },
    function(newValue) {
      $scope.mustChooseSong = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.player1Song },
    function(newValue) {
      $scope.player1Song = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.player2Song },
    function(newValue) {
      $scope.player2Song = newValue;
    }
  );
}]);