/* global app */
/* global factory */
app.service('chatService', ['$rootScope','socketService',function($rootScope,socketService) {
	
	var self = this;
	this.messages = [];

	socketService.socket.on("message:new",function(data){
		console.log("received : " + data);
		self.messages.push({playerName : data.playerName, message : data.message});
		//force refresh
		$rootScope.$apply();
	});
	
	this.sendMessage = function(message){
		socketService.socket.emit("message:send",message);
	}

}]);