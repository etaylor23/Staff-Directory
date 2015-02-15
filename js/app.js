(function(){

	var app = angular.module("staffDirectory",['ngRoute','ngCookies']);
	//create new angular module

	app.factory('staffDataFactory', ['$http','$routeParams', function($http,$routeParams,$scope) {
		
	    /*var getSource = function($scope) {
            $http.get(url).success(function(data) {
                response(data);
            });
			$http.post('/staffData', {msg:$routeParams._id}).
			success(function(data, status, headers, config) {
				console.log("got staffData for this staff member");
				$scope.staff = data;
			}).
			error(function() {
				console.log("failed to get staffData for this staff member");
			});
	    }
	    return getSource;

		*
		* This way can be used in conjunction with 'new staffDataFactory($scope);' in controller
		*

	    */

		return {
		    getSource : function() {
		        return $http.post('/staffData', {msg:$routeParams._id})
		    }
		}

	}]);

	app.factory('names', ['$http',function($http) {
		return {
		    getNames : function() {
		        return $http.get('/names')
		    }
		}
	}])

	app.controller('staff', ['$scope','$http','names', function($scope,$http,names) {
		$scope.profile = false;

		names.getNames().success(function(data) {
		    console.log("Got initial name set for this user");
		    console.log(data);
		    $scope.staffDirectory = data;
		})
	}]);



	app.controller("showProfile", ['$scope','$http','$location','$filter','$cookies','staffDataFactory', function($scope, $http, $location, $filter, $cookies,staffDataFactory) {

		$scope.readWrite = $cookies.readWrite;
		console.log($scope.readWrite);

		staffDataFactory.getSource().success(function(data) {
			$scope.staff = data;
		})


        $scope.close = function() {
        	$location.path('').replace();
        }

        $scope.addQualification = function() {
        	console.log($scope.qualificationName)
        	console.log($scope.qualificationLevelID);
        	console.log($scope.newQualificationLevel);
        	if ( $scope.newQualificationLevel !== undefined ) {
        		console.log("This will call server to create new qualification type and add new qualification to it");
        		var qualificationData = {'newQualificationLevel':$scope.newQualificationLevel, "qualificationName":$scope.qualificationName, "id":$scope.staff._id}
        		$http.post('/editQualification/'+$scope.qualificationName, qualificationData).
        		success(function(data, status, headers, config) {
        			console.log(data);
        			$scope.staff.details.qualifications.push(data);
        			delete $scope.newQualificationLevel;
        			delete $scope.qualificationLevelID;
        			$scope.qualificationName = '';
        			console.log('newQualificationLevel completed');
        		}).
        		error(function() {
        			console.log("newQualificationLevel failed to complete");
        		})
        	} else {
	        	if ($scope.qualificationName!=="") {
	        		var qualificationData = {'qualificationName':$scope.qualificationName, "id":$scope.staff._id, 'qualificationLevelID':$scope.qualificationLevelID, editType:"add"};
					$http.put('/editQualification/'+ $scope.qualificationName, qualificationData).
					success(function(data, status, headers, config) {
						console.log(data);
	    				var modelQual = $filter('filter')($scope.staff.details.qualifications, {_id: $scope.qualificationLevelID})[0];
	    				console.log(modelQual);
	    				modelQual.qualification.name.push($scope.qualificationName);
	    				$scope.qualificationName = '';
	        			delete $scope.newQualificationLevel;
	        			delete $scope.qualificationLevelID;
	    				console.log("addQualification completed");
					}).
					error(function() {
						console.log("addQualification failed to complete");
					});
	        	}	
        	}



        }


        $scope.removeQualification = function(qualificationLevelID,qualificationName,idx) {
        	console.log(qualificationLevelID);
        	console.log(qualificationName);

    		var qualificationData = {'qualificationName':qualificationName, "id":$scope.staff._id, 'qualificationLevelID':qualificationLevelID, editType:"remove"};

			$http.put('/editQualification/'+ qualificationName, qualificationData).
			success(function(data, status, headers, config) {
				console.log(data);
	        	var removedQualification = $filter('filter')($scope.staff.details.qualifications,{_id: qualificationLevelID})[0].qualification.name
	        	removedQualification.splice(idx,1);
				console.log("removeQualification completed");
			}).
			error(function() {
				console.log("removeQualification failed to complete");
			});
        }

        $scope.removeQualificationLevel = function(idx) {
        	var removeQualificationLevel = $scope.staff.details.qualifications[idx];

        	var qualificationData = { "id":$scope.staff._id, "qualificationLevelID":removeQualificationLevel }

        	$http.delete('/editQualification/'+$scope.staff._id+"/"+$scope.staff.details.qualifications[idx]._id).
        	success(function(data, status, headers, config) {
        		$scope.staff.details.qualifications = data;
        	}).
        	error(function() {
        		console.log("removeQualificationLevel failed to complete");
        	})
        }

	}]);

	app.controller("readWrite", [ '$scope','$cookies','$http', function($scope,$cookies,$http) {
		$http.get('/user').
		success(function(data) {
			data.permissions = parseInt(data.permissions);
			if(data.permissions === 0) {
				$scope.permissions = true;
				$scope.setReadWrite = function() {
					var readWrite = $cookies.readWrite;
					if(readWrite === "undefined" || readWrite === "Read") {
						$cookies.readWrite = "Write";
					} else {
						$cookies.readWrite = "Read";
					}

					$scope.readWrite = $cookies.readWrite;

				}
			} else {
				$scope.permissions = false;
			}		
		})
	}])


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
	
	/* This generates the template for showProfile controller 
	app.directive('profileDetails', function() {
		return {
			restrict: 'E',
			replace: 'false',
			templateUrl:"templates/profile.html"
		}
	});*/






})()

