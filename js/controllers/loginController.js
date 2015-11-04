/* global angular */
/* global $ */

/* LoginController */
angular.module('musicBattleApp')
	.controller('LoginController',
		['$rootScope', '$scope', 'playerService', 'notificationService',
			function ($rootScope, $scope, playerService, notificationService) {
				//Scope properties
				$scope.isLoggedIn = playerService.isLoggedIn;
				$scope.playerName = null;

				console.debug($scope.isLoggedIn);
				if ($scope.isLoggedIn === false || $scope.isLoggedIn === undefined)
					$('#myModal').modal({
						backdrop: 'static',
						keyboard: false
					});

				//Hit when a player is ready
				$scope.login = function () {
					console.log("login as " + $scope.playerName);
					if (playerService.addPlayer($scope.playerName)) {
						console.log("Player " + $scope.playerName + " ready");
						playerService.setPlayerName($scope.playerName);
						playerService.initPlayers();
						$('#myModal').modal('hide');
					}
				};
			}
		]);