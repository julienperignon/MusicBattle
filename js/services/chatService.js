/* global moment */
/* global app */
/* global factory */
app.service('chatService', ['$rootScope','socketService',function($rootScope,socketService) {
	
	var self = this;
	this.messages = [];

	socketService.socket.on("server:message:new",function(data){
		console.log("received : " + data);
		self.messages.push({date : moment(), playerName : data.playerName, message : data.message});
		//force refresh
		$rootScope.$apply();
	});
	
	this.sendMessage = function(message){
		socketService.socket.emit("client:message:send",message);
	}

}]);