
'use strict';

var app = angular.module("openStackApp",['ngResource', 'ngRoute']) ;

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
        when('/', {
            templateUrl: 'index.html',
            controller: 'NodesController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

app.factory('nodes', function ($resource){
    return $resource('/getNodes');
});

app.factory('nodesByAz', function ($resource){
    return $resource('/getNodesByAz');
});

app.factory('services', function ($resource){
    return $resource('/getServices');
});

app.controller('NodesController', ['$scope','nodes','nodesByAz','services',
    function($scope,getNodes,getNodesByAz,getServices) {
        $scope.refresh=function(){
            getNodes.query(function (data) {
                var regions = [];
                var sortedKeys = Object.keys(data[0].result).sort();
                for (var i = 0; i < sortedKeys.length; i++){
                    var key = sortedKeys[i];
                    var name = key.split(".");
                    var value = data[0].result[key];

                    if (i % 3 == 0)
                        regions.push ({"name":name[0], "info":0, "warning":0, "error":0}) ;

                    name[1] == "ERROR" ? regions[regions.length-1].error = value : name[1] == "INFO" ? regions[regions.length-1].info = value : regions[regions.length-1].warning = value;
                }

                $scope.regions = regions;
            });

            getNodesByAz.query(function (data) {
                var azones = [];
                var sortedKeys = Object.keys(data[0].result).sort();
                var regionName= "", azName = "";
                for (var i = 0; i < sortedKeys.length; i++){
                    var key = sortedKeys[i];
                    var name = key.split(".");
                    var value = data[0].result[key];

                    if (name[0] != regionName){
                        regionName = name[0];
                        azones.push ({"name":name[0], "regions":[] }) ;
                    }

                    if (name[1] != azName){
                        azName = name[1];
                        azones[azones.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
                    }

                    name[2] == "ERROR" ? azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].error = value : name[2] == "INFO" ? azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].info = value : azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].warning = value;
                }

                $scope.azones = azones;
            });

            getServices.query(function (data) {
                var services = [];
                var sortedKeys = Object.keys(data[0].result).sort();
                var serviceName= "", regionName = "";
                for (var i = 0; i < sortedKeys.length; i++){
                    var key = sortedKeys[i];
                    var name = key.split(".");
                    var value = data[0].result[key];

                    if (name[0] != serviceName){
                        serviceName = name[0];
                        regionName = name[1];
                        services.push ({"name":name[0], "regions":[] }) ;
                        services[services.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
                    }

                   else if (name[1] != regionName){
                        regionName = name[1];
                        services[services.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
                    }

                    name[2] == "ERROR" ? services[services.length-1].regions[services[services.length-1].regions.length-1].error = value : name[2] == "INFO" ? services[services.length-1].regions[services[services.length-1].regions.length-1].info = value : services[services.length-1].regions[services[services.length-1].regions.length-1].warning = value;
                }

                $scope.services = services;
            });
        }

    }
]);



