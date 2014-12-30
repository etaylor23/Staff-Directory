(function(){


	staffDirectory = [		
		{
			"staffID":"0", 
			"firstname":"Ellis", 
			"surname":"Taylor",
			"dob":"01.02.1991",
			"team":"Web Development",
			"department":"Marketing and Communications",
			"image":"files/ellis.jpg",
			"qualifications":[
				{ 
					"qualification": {
						"level":"GCSE",
						"subjects":["Maths","Science"]					
					}
				},
				{
					"qualification": {
						"level":"A Level",
						"subjects":["Advanced Maths","Chemistry","Physics"]						
					}
				},
				{
					"qualification": {
						"level":"Undergraduate Degree",
						"subjects":["Astrophysics"]
					}
				}
			]
		},
		{
			"staffID":"1", 
			"firstname":"Claudia", 
			"surname":"Ryman",
			"dob":"14.05.1996",
			"team":"Marketing Services",
			"department":"Marketing and Communications",
			"image":"files/claudia.jpg",
			"qualifications":[
				{ 
					"qualification": {
						"level":"GCSE",
						"subjects":["Maths","Science"]					
					}
				},
				{
					"qualification": {
						"level":"A Level",
						"subjects":["Advanced Maths","Chemistry","Physics"]						
					}
				},
				{
					"qualification": {
						"level":"Undergraduate Degree",
						"subjects":["Astrophysics"]
					}
				}
			]
		},
		{
			"staffID":"2", 
			"firstname":"Chloe", 
			"surname":"Taylor",
			"dob":"22.11.1992",
			"team":"Construction",
			"department":"Estates",
			"image":"files/claudia.jpg",
			"qualifications":[
				{ 
					"qualification": {
						"level":"GCSE",
						"subjects":["Maths","Science"]					
					}
				},
				{
					"qualification": {
						"level":"A Level",
						"subjects":["Advanced Maths","Chemistry","Physics"]						
					}
				},
				{
					"qualification": {
						"level":"Undergraduate Degree",
						"subjects":["Astrophysics"]
					}
				}
			]
		}
	]

	department = [
		{
			"name":"Marketing and Communications",
			"teams": [
			
			]
		}
	]




	var app = angular.module("staffDirectory",['ngRoute']);
	//create new angular module

	app.controller('staff', ['$scope','$http', function($scope,$http) {
		$scope.profile = false;
		//$scope.staffDirectory = staffDirectory;

		$http.get('/getNames').
		  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    console.log(data);
		    $scope.staffDirectory = data;

		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}]);



	app.controller("showProfile", ['$scope','$http','$routeParams','$location', function($scope, $http, $routeParams, $location) {

		$http.post('/getStaffData', {msg:$routeParams.staffID}).
			success(function(data, status, headers, config) {
				console.log(data);
				var unwrapStaff = data[0];
				$scope.staff = unwrapStaff;

			}).
			error(function() {
				console.log("Lose");
			});

        $scope.submit = function() {
        	//when submit is called
        	console.log($scope.newQual);
        	console.log($scope.qualType);
            if ($scope.newQual!=="") {
       	        //if staff entry exists and new qualification value is not empty
       	        console.log($scope.staff.qualifications[$scope.qualType].qualification.subjects);
       	        //log out old qualification set
                $scope.staff.qualifications[$scope.qualType].qualification.subjects.push(this.newQual);
                //push new qualification into array
                console.log($scope.staff.qualifications[$scope.qualType].qualification.subjects);
                //log out new qualification set
                $scope.newQual = '';
                //reset new qualification field to empty
                var data = { name: $scope.staff.qualifications[$scope.qualType].qualification.subjects };
            	//wrap all object in array
            	console.log(data);
          		//log all array values
			}
        };

        $scope.remove = function($event,index,array) {
        	console.log("---- Starting removal ----");
        	console.log("---- Ending removal ----");
        };

        $scope.close = function() {
        	$location.path('').replace();
        }

        $scope.addQualification = function() {
        	console.log("About to add qualification");
        	console.log($scope.newQual);
        	console.log($scope.qualType);
        	if ($scope.newQual!=="") {
        		var qualificationData = {'staffID':$routeParams.staffID,'data':$scope.newQual,'level':$scope.qualType,"id":$scope.staff._id};
				$http.put('/addQualification/'+ $scope.newQual, qualificationData).
					success(function(data, status, headers, config) {
						console.log(data);
					}).
					error(function() {
						console.log("Lose");
					});
        	}
        }

	}]);

	app.controller("newQualification", ['$scope','$http','$routeParams','$location', function($scope, $http, $routeParams, $location) {
		alert("Test");
	}]);


	app.config(['$routeProvider',
	  function($routeProvider) {
	    $routeProvider.
	      when('/staff/:staffID', {
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

