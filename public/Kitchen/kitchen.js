'use strict';
angular.module('myApp').controller('kitchen', function($scope, $http, $location, $rootScope, SocketKitchen){
	SocketKitchen.on("newOrder", function (data) {
        $scope.newOrders.unshift(data);
    });
	
	$scope.newOrders = [];
	$scope.orders = [];
	var url = '/server/orders/?status=Заказано';
	$http.get(url).then(function(data) {
		if(!data.data.error) {
			$scope.newOrders = data.data;
		}
	})
	.catch(function(data) {
		console.log(data);
	});
	
	var url = '/server/orders/?status=Готовится';
	$http.get(url).then(function(data) {
		if(!data.data.error) {
			$scope.orders = data.data;
		}
	})
	.catch(function(data) {
		console.log(data);
	});
	
	$scope.startCook = function(id, index) {
		var url = '/server/orders/' + id;
		$http.put(url, {"status": "Готовится"}).then(function(data) {
			if(!data.data.error) {
				Materialize.toast('Блюдо готовится', 1000);
				$scope.newOrders.splice(index, 1);
				$scope.orders.push(data.data);
			}
		})
		.catch(function(data) {
			console.log(data);
		});
	}
	
	$scope.finishCook = function(id, index) {
		var url = '/server/orders/' + id;
		$http.put(url, {"status": "Доставляется"}).then(function(data) {
			if(!data.data.error) {
				Materialize.toast('Блюдо готово!', 1000);
				$scope.orders.splice(index, 1);				
				var url = '/server/orders/' + id + '/deliver';
				$http.get(url).then(function(data) {
					if(!data.data.error) {
						console.log(data);
					}
				})
				.catch(function(data) {
					console.log(data);
				});
			}
		})
		.catch(function(data) {
			console.log(data);
		});
	}
});