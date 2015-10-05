/* global moment */
/* global app */
/* global factory */
app.service('gameService', ['$http','socketFactory','configurationService','notificationService','playerService',function($http,socketFactory,configurationService,notificationService,playerService) {
	
	var self = this;
	
	
	this.canPlay = null;
	this.choosingSongs = null;
	this.playing = null
	this.player1 = null;
	this.player2 = null;
	this.player1Song = null;
	this.player2Song = null;
	this.mustChooseSong = false;
	this.position = null;
	this.playing = null;
	this.canVote = true;
	
	getGameStatus();
	
	//We received an update about the game status
	socketFactory.on("server:game:status",function(data){
		setGameStatutFromJsondata(data);
	});
	
	//We are told to choose a song ! Do so :)
	socketFactory.on("server:game:choosesong",function(data){
		console.log("i must choose a song");
		self.mustChooseSong = true;
		self.canVote = false;
		//Am i first or second player ?
		self.position = data.position;
		notificationService.displayInformation("You have been chosen to play as player " + data.position + " !");
	});
	
	//A song has been chosen
	socketFactory.on("server:game:chosesong",function(data){
		if(data.playerName !==playerService.playerInformations.playerName)
			notificationService.displayInformation(data.playerName +" chose the song " + data.songLink);
	});
	
	//A song has been voted for
	socketFactory.on("server:game:votesong",function(data){
		if(data.playerName !==playerService.playerInformations.playerName)
			notificationService.displayInformation(data.playerName +" vote for the song number " + data.songNumber);
	});

	//The player received his result, is it a win or a loss ?
	socketFactory.on("server:game:ownresult",function(data){
		if(data.result === 'WIN')
			notificationService.displayInformation('You won the round ! Keep it up ! :)');
		else if(data.result === 'LOSS'){
			notificationService.displayInformation('You lost the round :( Maybe next round ? :)');
		}
	});
	
	//the player received the result of the current round
	socketFactory.on("server:game:result",function(data){
		console.log("A");
		self.mustChooseSong = false;
		notificationService.displayInformation(data.winner + ' won the round ! Next round coming soon !');
	});
	
	
	//the player received information from the server that his song link has been received
	socketFactory.on("server:game:acksong",function(data){
		console.log("B");
		self.mustChooseSong = false;
	});
	
	
	//When a player chose a song from the UI
	this.chooseSong = function(songLink){
		socketFactory.emit("client:game:chosesong",songLink,function(){
			console.log("C");
			self.mustChooseSong = false;	
		});	
	}
	
	this.voteForVideo = function(videoNumber){
		socketFactory.emit("client:game:votesong",videoNumber);
	}
	
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
		self.player1Song = data['player1Song'];
		self.player2Song = data['player2Song'];
	}	

}]);