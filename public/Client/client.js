'use strict';
angular.module('myApp').controller('client', function ($scope, $http, $location, $rootScope, SocketClient) {
	$rootScope.check();
	SocketClient.on("ChangeOfStatus", function (changedOrder) {
		console.log(changedOrder);
		$scope.orders = $scope.orders.map(function (order) {
			if (order._id == changedOrder._id)
				order = changedOrder;
			return order;
		})
	});
	SocketClient.on("orderDeleted", function (deletedOrder) {
		console.log(deletedOrder);
		$scope.orders = $scope.orders.filter(function (order) {
			return order._id != deletedOrder._id;
		});
	});
	if(!$rootScope.isAutorized) {
		$location.path("/login");
	} else {
		$scope.clientInfo = '';
		var url = '/server/clients/?id=' + sessionStorage.getItem('client');
		$http.get(url).then(function(data) {
			if(!data.data.error) {
				console.log(SocketClient);
				SocketClient.emit("newConnect", {clientID: data.data._id});
				$scope.clientInfo = data.data;
				$scope.orders = {};
				var url = '/server/orders/?client=' + sessionStorage.getItem('client');
				$http.get(url).then(function(data) {
					$scope.orders = data.data;
				})
				.catch(function(data) {
					console.log(data);
				});
				
				$scope.addMoney = function() {				
					var url = '/server/clients/' + sessionStorage.getItem('client');
					$http.put(url).then(function(data) {
						Materialize.toast('Баланс пополнен', 4000);
						$scope.clientInfo.balance +=100;
					})
					.catch(function(data) {
						Materialize.toast('Баланс не пополнен', 4000);
						console.log(data);
					});
				}
				/*
				SocketClient.on("balanceChanged", function (balance) {
					updateBalance(balance);
				});*/
			}
		})
		.catch(function(data) {
			console.log(data);
		});
	}
});