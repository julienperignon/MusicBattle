/* global angular */
/* global $ */

/* PlayerController */
angular.module('musicBattleApp').controller('GameController',['$scope','$rootScope','$sce','gameService','youtubeService',
  function($scope,$rootScope,$sce,gameService,youtubeService){
 
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
  $scope.hasVoted = false;
  $scope.canVote = true;
  $scope.playersWhoVotedForSong1 = [];
  $scope.playersWhoVotedForSong2 = [];
  $scope.theme = null;
  
  //Scope functions
  $scope.chooseSong = function(){
    gameService.chooseSong($scope.songLink);
    //$scope.mustChooseSong = false;
    console.log("link chosen : " + $scope.songLink);
    $scope.songLink = null;
  }
  
   $scope.voteForVideo = function(videoNumber){
     gameService.voteForVideo(videoNumber);
     // $scope.hasVoted = true;
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
      console.log("watch must choosee song");
      $scope.mustChooseSong = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.player1Song },
    function(newValue) {
      $scope.player1Song = $sce.trustAsResourceUrl(youtubeService.getEmbedVideoUrlFromNormalUrl(newValue));
    }
  );
  $scope.$watch(function(scope) { return gameService.player2Song },
    function(newValue) {
      $scope.player2Song = $sce.trustAsResourceUrl(youtubeService.getEmbedVideoUrlFromNormalUrl(newValue));
    }
  );
   $scope.$watch(function(scope) { return gameService.canVote },
    function(newValue) {
      $scope.canVote = newValue;
    }
  );
  $scope.$watch(function(scope) { return gameService.hasVoted },
    function(newValue) {
      $scope.hasVoted = newValue;
    }
  );
  
   $scope.$watch(function(scope) { return gameService.playersWhoVotedForSong1 },
    function(newValue) {
      $scope.playersWhoVotedForSong1 = newValue;
    }
  );
  
   $scope.$watch(function(scope) { return gameService.playersWhoVotedForSong2 },
    function(newValue) {
      $scope.playersWhoVotedForSong2 = newValue;
    }
  );
  
  $scope.$watch(function(scope) { return gameService.theme },
    function(newValue) {
      $scope.theme = newValue;
    }
  );
}]);