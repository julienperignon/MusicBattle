/* global angular */
//Chat controller
//Handles(inbound and outbound) messages for the chat

angular.module('musicBattleApp').controller('ChatController',['$scope','socketService',"chatService","playerService",function($scope,socketService,chatService,playerService){
	
	//scope services
	$scope.playerService = playerService;
	$scope.chatService = chatService;
	
	$scope.message =null;
	
	$scope.sendMessage = function(){
		chatService.sendMessage($scope.message);
		$scope.message = null;
	}
	
}]);