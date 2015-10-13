/* global angular */
//Score controller

angular.module('musicBattleApp').controller('ScoreController',['$scope','scoreService',function($scope,scoreService){
	
	//Scope properties
	$scope.scores = {};
	
	scoreService.initScores();
	
	$scope.$watch(function(scope) { return scoreService.scores },
      function(newValue) {
          $scope.scores = newValue;
      }
    );
	
	
}]);