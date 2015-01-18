(function(){

	var app = angular.module("staffDirectory",['ngRoute']);
	//create new angular module

	app.controller('staff', ['$scope','$http', function($scope,$http) {
		$scope.profile = false;
		//$scope.staffDirectory = staffDirectory;

		$http.get('/names').
		  success(function(data, status, headers, config) {
		    console.log("Got initial name set for this user");
		    console.log(data);
		    $scope.staffDirectory = data;

		  }).
		  error(function(data, status, headers, config) {
		    console.log("Failed to get initial name set for this user");
		});
	}]);



	app.controller("showProfile", ['$scope','$http','$routeParams','$location','$filter', function($scope, $http, $routeParams, $location, $filter) {

		$http.post('/staffData', {msg:$routeParams._id}).
			success(function(data, status, headers, config) {
				console.log("got staffData for this staff member");
				$scope.staff = data;
			}).
			error(function() {
				console.log("failed to get staffData for this staff member");
			});


        $scope.close = function() {
        	$location.path('').replace();
        }

        $scope.addQualification = function() {

        	console.log($scope.qualificationName)
        	console.log($scope.qualificationLevelID);

        	if ($scope.qualificationName!=="") {
        		var qualificationData = {'qualificationName':$scope.qualificationName, "id":$scope.staff._id, 'qualificationLevelID':$scope.qualificationLevelID, add:true};
				$http.put('/addQualification/'+ $scope.qualificationName, qualificationData).
					success(function(data, status, headers, config) {
						console.log(data);
        				var modelQual = $filter('filter')($scope.staff.qualifications, {_id: $scope.qualificationLevelID})[0];
        				modelQual.qualification.name.push($scope.qualificationName);
        				console.log("addQualification completed");
					}).
					error(function() {
						console.log("addQualification failed to complete");
					});
        	}

        }

        $scope.removeQualification = function(qualificationLevelID,qualificationName,idx) {
        	//could still pass $event,index,array like old remove function
        	console.log(qualificationLevelID);
        	console.log(qualificationName);
        	var removedQualification = $filter('filter')($scope.staff.qualifications,{_id: qualificationLevelID})[0].qualification.name
        	removedQualification.splice(idx,1);

        }

	}]);


	app.config(['$routeProvider',
	  function($routeProvider) {
	    $routeProvider.
	      when('/staff/:_id', {
	      	//put /qualifications after staffID and try and pull it back into the controller
	        templateUrl: 'partials/profile.html',
	        controller: 'showProfile'
	        /* The templateURL here generates the second table */
	      }).
	      otherwise({
	        redirectTo: ''
	      });
	}]);
	
	/* This generates the template for showProfile controller */
	app.directive('profileDetails', function() {
		return {
			restrict: 'E',
			replace: 'false',
			templateUrl:"templates/profile.html"
		}
	});






})()

