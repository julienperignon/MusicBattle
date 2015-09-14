/* global io */
/* global noty */
/* global angular */
var app = angular.module('musicBattleApp', ['ngMessages']);

app.run(function($rootScope) {
  
  //To Enable test options
  $rootScope.testMode = true;
  
  //url to the socket io server
  $rootScope.urlSocketServer = "http://localhost:4000";
  
});





