/* global app */
/* global factory */
app.service('socketService', [function() {
    
    console.log("socketService loaded");
    
    //Configuration socket.io 
    this.socket = io('http://localhost:4000');

}]);