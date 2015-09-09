
/* Controller handling the music themes */
angular.module('musicBattleApp').controller('ThemeController', function($scope){
  
  //Actual selected theme
  $scope.selectedTheme = null;
  
  $scope.themeSelected = false;
  
  $scope.themeSelected = function(){
     console.log("Theme " + $scope.selectedTheme + " has been selected");
     $scope.themeSelected = true;
  }
  
  // themes to be chosen for the battle
  $scope.themes =  [
    {id:1,name : "80's"},
    {id:2,name : "90's"},
    {id:3,name : "2000's"},
    {id:4,name : "2010's"},
    {id:5,name : "Present"},
  ];

});