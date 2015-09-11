/* global app */
/* global factory */
app.service('chatService', ['socketService',function(socketService) {
	
	 
// 	
// 	this.messages = [];
// 
// 	function addMessage(data){
// 		this.messages.push({playerName : data.playerName, message : data.message})
// 	}
// 	
// 	socketService.socket.on("newMessage",function(data){
// 		console.log('newMessage');
// 		addMessage(data);
// 		console.log(data.playerName + ":" + data.message);
// 	});
// 	
// 	this.sendMessage = function(message){
// 		socketService.socket.emit("sendMessage",{message:message})
// 	}

}]);