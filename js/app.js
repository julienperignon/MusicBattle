/* global noty */
/* global angular */
var app = angular.module('musicBattleApp', ['ngMessages']);

app.run(function($rootScope) {
  
  //To Enable test options
  $rootScope.testMode = true;
  
  $rootScope.mustSelectTheme = false;
  
  $rootScope.displaySuccess = function(text){
    noty({text: text, type:'success'});
  };
  $rootScope.displayInformation = function(text){
    noty({text: text, type:'information'});
  };
  $rootScope.displayError = function(text){
    noty({text: text, type:'error'});
  };
  
   //Noty configuration
  $.noty.defaults = {
    layout: 'bottom',
    theme: 'relax', // or 'relax'
    type: 'success',
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: {
        open: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceInLeft'
        close: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceOutLeft'
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    },
    timeout: 1000, // delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 5, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {},
        onCloseClick: function() {},
    },
    buttons: false // an array of buttons
  };
  
});





