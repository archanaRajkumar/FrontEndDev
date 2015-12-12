
var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._; 
}]);

angular.module("HackerearthMock",['underscore','LocalStorageModule']).config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('HackerearthMock')
    .setStorageType('sessionStorage')
    .setNotify(true, true)
})
.controller("loadEventController", ['$scope','eventDataService','_','localStorageService', function($scope,eventDataService,_,localStorageService){
	
  eventDataService.fetchEventData()
                .then(function(data) {
                	_.each(data, function(evt){
        	evt.like=localStorageService.get(evt.name);
        
        });
                 $scope.events =data; 
                 console.log(data);
                },
                function(error) {
                   $scope.error=error;
                });
  
    $scope.toggleLike=function(event){
	_.each($scope.events, function(evt){

    		if(evt.name==event.name)
    		{
            evt.like=!evt.like
    		localStorageService.set(evt.name,evt.like);
    		return evt.like;

    		}
    	})	
	

}
       
}])
.service("eventDataService", ["$http","$q",function($http,$q){
	
var eventData=[];
var likedEvents=[];
var url="https://hackerearth.0x10.info/api/problems?type=json&query=list_problems";
this.fetchEventData=function(){
	var defer=$q.defer();
	
    $http.get(url).success(function(data) {
        eventData=data.problems;
        
        eventData=_.filter(eventData, function(evt){
        	 return (evt.name.length>0)
        });
        defer.resolve(eventData);
        }).error(function(e){
    	defer.reject("failed to get data");
    })
   return defer.promise;	
}

}]);


