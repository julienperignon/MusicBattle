/* global moment */
/* global app */
/* global factory */
app.service('chatService', ['$rootScope','socketService',function($rootScope,socketService) {
	
	var self = this;
	this.messages = [];

	socketService.socket.on("server:message:new",function(data){
		console.log(data);
		self.messages.push({date : moment().format('HH:mm:ss'), playerName : data.playerName, message : data.message});
		//force refresh
		$rootScope.$apply();
	});
	
	this.sendMessage = function(message){
		console.log("this.sendMessage");
		socketService.socket.emit("client:message:send",message);
	}

}]);