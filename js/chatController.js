//Chat controller
//Handles(inbound and outbound) messages for the chat

angular.module('musicBattleApp').controller('ChatController',function($rootScope,$scope){
	$rootScope.socket.on("newMessage",function(data){
		console.log(data.playerName + ":" + data.message);
	});
	
	$scope.sendMessage = function(message){
		$rootScope.socket.emit("sendMessage",{message:message})
	}
});