
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

app.controller('NodesController', ['$scope','nodes',
    function($scope,getNodes) {
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


        }

    }
]);



