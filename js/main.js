/* global angular */
var app = angular.module('musicBattleApp', []);

app.run(function($rootScope) {
  $rootScope.test = "Hi";
});