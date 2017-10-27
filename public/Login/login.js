'use strict';
angular.module('myApp').controller('login', function ($scope, $http, $location, $rootScope) {
	$rootScope.check();
	$scope.login = function() {
		var url = '/server/clients/?email=' + this.email + '&name=' + this.name;
		var newClient = {"name": this.name, "email": this.email};
		$http.get(url).then(function(data) {
			if(data.data.error) {
				var url = '/server/clients/';
				$http.post(url, newClient).then(function(data) {
					sessionStorage.setItem('client', data.data._id);
					$location.path("/");
					$rootScope.isAutorized = true;
					
				})
				.catch(function(data) {
					console.log(data);
				})
			} else {
				sessionStorage.setItem('client', data.data._id);
				$rootScope.isAutorized = true;
                $location.path("/");
			}		
		})
		.catch(function(data) {
			console.log(data);
		})
	}
});