/* global moment */
/* global app */
/* global factory */
app.service('gameService', ['$http','socketFactory','configurationService','notificationService',function($http,socketFactory,configurationService,notificationService) {
	
	var self = this;
	
	
	this.canPlay = null;
	this.choosingSongs = null;
	this.playing = null
	this.player1 = null;
	this.player2 = null;
	
	getGameStatus();
	
	//We received an update about the game status
	socketFactory.on("server:game:status",function(data){
		setGameStatutFromJsondata(data);
	});
	
	//We are told to choose a song ! Do so :)
	socketFactory.on("server:game:choosesong",function(data){
		//For now only emitting a notification
		notificationService.displayInformation("You have been chosen to play !");
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
		self.choosingSongs = data['choosingSongs'];
		self.playing = data['playing'];
		self.player1 = data['player1'];
		self.player2 = data['player2'];
	}
	

}]);