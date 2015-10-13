/* global moment */
/* global app */
/* global factory */
app.service('scoreService', ['$http','configurationService','socketFactory',function($http, configurationService,socketFactory ) {
	
	var self = this;
	
	this.scores = {};
	
    //We received an update about the game status
	socketFactory.on("server:game:status",function(data){
		self.scores = data.scores;
	});
    
	//Api
    this.initScores = function(){
        $http.get(configurationService.urlSocketServer + "/scores").then(function(res){
            self.scores = res.data;
        });
        
    }
    
    

}]);