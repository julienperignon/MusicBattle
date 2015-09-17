/* global io */
/* global app */
/* global factory */
app.service('socketService', ['$rootScope',function($rootScope) {
    
    console.log("socketService loaded");
    
    //Configuration socket.io 
    this.socket = io($rootScope.urlSocketServer);

}]);