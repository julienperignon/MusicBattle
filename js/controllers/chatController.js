/* global angular */
//Chat controller
//Handles(inbound and outbound) messages for the chat

angular.module('musicBattleApp').controller('ChatController',['$scope','socketService',"chatService","playerService",function($scope,socketService,chatService,playerService){
	
	$scope.message =null;
	$scope.messages = [];

	
	$scope.playerService = playerService;
	
	socketService.socket.on("newMessage",function(data){
		$scope.messages.push({playerName : data.playerName, message : data.message});
		//force refresh
		$scope.$apply();
	});
	
	$scope.sendMessage = function(){
		console.log("in $scope.sendMessage ");
		socketService.socket.emit("sendMessage",$scope.message);
		$scope.test = $scope.message;
		$scope.message=null;
	}
	
	// 
	// $scope.sendMessage = function(){
	// 	console.log("chatController.sendMessage");
	// 	chatService.sendMessage($scope.message);
	// 	$scope.message ="";
	// }

}]);