/* global moment */
/* global app */
/* global factory */
app.service('gameService', ['$http','socketService','configurationService',function($http,socketService,configurationService) {
	
	var self = this;
	
	
	this.canPlay = null;
	this.playing = null
	this.player1 = null;
	this.player2 = null;
	
	getGameStatus();
	
	socketService.socket.on("server:game:status",function(data){
		setGameStatutFromJsondata(data);
		//force refresh
		//$rootScope.$apply();
	});
	
	//Get the game status server side
	function getGameStatus(data){
		if(data === undefined)
		{
			$http.get(configurationService.urlSocketServer + "/status").then(function(res){
				setGameStatutFromJsondata(res.data);
			});
		}
		else{
			setGameStatutFromJsondata(data);
		}
	}
	
	function setGameStatutFromJsondata(data){
		self.canPlay = data['canPlay'];
		self.playing = data['playing'];
		self.player1 = data['player1'];
		self.player2 = data['player2'];
	}
	

}]);