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

	app.factory('department', ['$http',function($http) {
		return {
		    getDepartment : function() {
		        return $http.get('/department')
		    }
		}
	}])
	app.factory('team', ['$http',function($http) {
		return {
		    getTeam : function() {
		        return $http.get('/team')
		    }
		}
	}])

	app.controller('staff', ['$scope','$http','department','team', function($scope,$http,department,team) {
		$scope.profile = false;

		department.getDepartment().success(function(data) {
		    console.log("Got initial name set for this user");
		    console.log(data);
		    $scope.department = data;
		});
		team.getTeam().success(function(data) {
			
			$scope.team = data;
			console.log($scope.team);
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

        $scope.edit = function() {
        	//alert("Test");
        	
        	if($scope.editValue === false) {
        		$scope.editValue = true;
        	} else {
        		$scope.editValue = false;
        	}
        }

        $scope.editValue = false;

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

	app.controller("staffSearch", [ '$scope','$http', function($scope,$http) {
		$scope.searchType = "Person";

		var makeSearch = true;
		var timer = false;
		var searchActive = false;
		$scope.resultsReturned = false;


		$scope.typing = function() {
			var search = {
				searchParams: {
					type:$scope.searchType,
					text:$scope.searchText				
				}

			}
			var searchQuery = search.searchParams.text + "/" + search.searchParams.type;
			var searchTextCount = $scope.searchText.length;

			if(searchTextCount >= 3) {
				if($scope.resultsReturned === false) {
					$(".results").css({"width":"500px","overflow":"initial","right":"0px","overflow-y":"scroll"});
					$scope.resultsReturned = true;
				}

				setTimeout(function() {
					timer = true;
					console.log(timer);
					setTimeout(function() {
						timer = false;
						console.log(timer);
					},2500);
				}, 0);

				if(timer === true) {
					console.log("Dont make search");
					return false;
				} else {
					$http.get('/search/'+searchQuery).success(function(data) {
						$scope.searchResults = data;
						console.log("Win");
					}).error(function() {
						console.log("Lose");
					})
				}

			} else {
				if($scope.resultsReturned === true) {
					$(".results").css({"width":"0px","overflow":"hidden","right":"-500px","transition":"all 2s ease 0s"});
					$scope.resultsReturned = false;
				}
			}		
		}

		$scope.alterSearchType = function() {
			var search = {
				searchParams: {
					type:$scope.searchType,
					text:$scope.searchText				
				}

			}
			var searchQuery = search.searchParams.text + "/" + search.searchParams.type;
			var searchTextCount = $scope.searchText.length;
					$http.get('/search/'+searchQuery).success(function(data) {
						$scope.searchResults = data;
						console.log("Win");
					}).error(function() {
						console.log("Lose");
					})
		}





		//write search on submit click and enter

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

