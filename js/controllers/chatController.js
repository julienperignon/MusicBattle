/* global emojify */
/* global angular */
//Chat controller
//Handles(inbound and outbound) messages for the chat

angular.module('musicBattleApp').controller('ChatController',['$scope',"chatService","playerService",function($scope,chatService,playerService){
	
	//Scope properties
	$scope.message =null;
	$scope.messages=[];
	$scope.isLoggedIn = playerService.isLoggedIn;
	
	//Scope Watchs
	$scope.$watch(function(scope) { return chatService.messages },
      function(newValue) {
          $scope.messages = newValue;
      }
    );
	
	$scope.$watch(function(scope) { return playerService.playerInformations.isLoggedIn },
      function(newValue) {
          $scope.isLoggedIn = newValue;
      }
    );
	
	
	//Scope methods
	$scope.sendMessage = function(){
		chatService.sendMessage($scope.message);
		$scope.message = null;
	}
	
	var hasRegistered = false;
		$scope.$watch(function() {
		if (hasRegistered) return;
		hasRegistered = true;
		$scope.$$postDigest(function() {
			hasRegistered = false;
			emojify.run();
		});
	});
	
}]);