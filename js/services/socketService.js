/* global io */
/* global app */
/* global factory */
app.service('socketService', ['configurationService',function(configurationService) {
    
    console.log("socketService loaded");
    
    //Configuration socket.io 
    this.socket = io(configurationService.urlSocketServer);

}]);