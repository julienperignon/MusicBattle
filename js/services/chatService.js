/* global moment */
/* global app */
/* global factory */
app.service('chatService', ['$rootScope','socketFactory',function($rootScope,socketFactory) {
	
	var self = this;
	this.messages = [];

	socketFactory.on("server:message:new",function(data){
		console.log(data);
		self.messages.push({date : moment().format('HH:mm:ss'), playerName : data.playerName, message : data.message});
		//force refresh
		$rootScope.$apply();
	});
	
	this.sendMessage = function(message){
		console.log("this.sendMessage");
		socketFactory.emit("client:message:send",message);
	}

}]);