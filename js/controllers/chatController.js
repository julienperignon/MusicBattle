/* global angular */
//Chat controller
//Handles(inbound and outbound) messages for the chat

angular.module('musicBattleApp').controller('ChatController',['$scope','socketService',"chatService","playerService",function($scope,socketService,chatService,playerService){
	
	//Scope properties
	$scope.message =null;
	$scope.messages=[];
	$scope.canPlay = playerService.canPlay;;
	
	//Scope Watchs
	$scope.$watch(function(scope) { return chatService.messages },
      function(newValue) {
          $scope.messages = newValue;
      }
    );
	
	$scope.$watch(function(scope) { return playerService.playerInformations.isSet },
      function(newValue) {
          $scope.canPlay = newValue;
      }
    );
	
	
	//Scope methods
	$scope.sendMessage = function(){
		chatService.sendMessage($scope.message);
		$scope.message = null;
	}
	
}]);