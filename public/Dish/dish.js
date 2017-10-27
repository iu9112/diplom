'use strict';
angular.module('myApp').controller('dish', function ($scope, $http, $location, $rootScope) {
	$rootScope.check();
	if(!$rootScope.isAutorized) {
		$location.path("/login");
	} else {
		$scope.dishes = {};	
		var url = '/server/dishes';
		$http.get(url).then(function(data) {
			if(!data.data.error) {
				$scope.balance = 0;
				var url = '/server/clients/?id=' + sessionStorage.getItem('client');
				$http.get(url).then(function(data) {
					$scope.balance = data.data.balance;
				})
				.catch(function(data) {
					console.log(data);
				});
				$scope.dishes = data.data;
				$scope.addDish = function(id) {
					var url = '/server/orders/';
					$http.post(url, {"client": sessionStorage.getItem('client'), "dish": id}).then(function(data) {
						if(!data.data.error) {
							Materialize.toast('Блюдо добавлено', 1000);
							$location.path("/")
						} else {
							Materialize.toast('Блюдо не добавлено!', 1000);
						}
					})
					.catch(function(data) {
						console.log(data);
					});
				}
				$scope.checkPrice = function (price) {					
					return $scope.balance >= price;
				};
				$scope.needMoney = function (price) {
					return price - $scope.balance;
				};
			}
		})
		.catch(function(data) {
			console.log(data);
		});
	}
});