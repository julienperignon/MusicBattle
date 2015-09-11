/* global app */
/* global factory */
app.factory('playerService', [function() {
    console.log("playerService loaded");
    
    var helloWorldLogic = function helloWorld(){
        console.log("hello world");
    };
    var sayMooLogic = function sayMoo(){
        console.log("Moo");
    };
    return{
        helloWorld : helloWorldLogic,
        sayMoo : sayMooLogic
    }
 }]);