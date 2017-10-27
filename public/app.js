'use strict';
var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'btford.socket-io']);

myApp.run(['$rootScope', '$location', function($rootScope, $location) {
	
	$rootScope.isAutorized = false;
	$rootScope.check = function () {
		var data = sessionStorage.getItem('client');
		if(!data) {
			$location.path("/login");
			$rootScope.isAutorized = false;
		}
		else {
			$rootScope.isAutorized = true;
		}
	};
	
	$rootScope.logout = function() {
		$rootScope.isAutorized = false;
		sessionStorage.removeItem('client');
    };
}])
myApp.config(['$routeProvider', '$locationProvider', function($routeProvide, $locationProvider) {
	$routeProvide
		.when('/', {
			templateUrl: 'Client/client.html',
			controller: 'client'
		})
		.when('/login', {
			templateUrl: 'Login/login.html',
			controller: 'login'
		})
		.when('/dishes', {
			templateUrl: 'Dish/dish.html',
			controller: 'dish'
		})
		.when('/kitchen', {
			templateUrl: 'Kitchen/kitchen.html',
			controller: 'kitchen'
		})
		.otherwise({
			redirectTo: '/login'
		});	
}]);
myApp.constant('config', {
	apiUrl: 'https://stark-tundra-70250.herokuapp.com/'
});

myApp.factory("SocketClient", function (socketFactory, config) {
	return socketFactory({
		ioSocket: io.connect(config.apiUrl + "/client")
	});
});

myApp.factory("SocketKitchen", function (socketFactory, config) {
	return socketFactory({
		ioSocket: io.connect(config.apiUrl + "/kitchen")
	});
});

