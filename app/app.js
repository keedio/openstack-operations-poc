
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
app.factory('nodesBy', function ($resource){
    return $resource('/getNodesBy');
});

app.factory('nodesAzBy', function ($resource){
    return $resource('/getNodesAzBy');
});

app.factory('servicesBy', function ($resource){
    return $resource('/getServicesBy');
});

app.controller('NodesController', ['$scope','nodes','nodesByAz','services','nodesBy','nodesAzBy','servicesBy',
    function($scope,getNodes,getNodesByAz,getServices,getNodesBy, getNodesAzBy, getServicesBy) {
        $scope.init=function(){
            getNodes.query(function (data) {
                parseNodes(data);
            });

            getNodesByAz.query(function (data) {
                parseNodesByAz(data);
            });

            getServices.query(function (data) {
               parseServices(data);
            });
        }
        $scope.refresh = function(logEntries,objectRegions,nodeDuring,servicesDuring){
           var regions = []
            jQuery.each(objectRegions,function (i,region) {
               if(region.id != undefined) regions.push(region.id)
               else  regions.push(region)
            });
            if (regions.length ==1) regions.push(regions[0]);
           getNodesBy.query({"during": nodeDuring, "nodeType": logEntries, "regions": regions},
                function(data){
                    parseNodes(data);
                });

            getNodesAzBy.query({"during": nodeDuring, "nodeType": logEntries, "regions": regions},
                function(data){
                    parseNodesByAz(data);
                });

            getServicesBy.query({"during": servicesDuring},
                function(data){
                    parseServices(data);
                });
        };
        $scope.logEntries  = {
            availableOptions: [
                {id: 'compute', name: 'Compute'},
                {id: 'storage', name: 'Storage'}
            ],
            selectedOption: {id: 'compute', name: 'Storage'}
        };

        $scope.regionEntries  = {
            availableOptions: [
                {id: 'Boston', name: 'Boston'},
                {id: 'Seattle', name: 'Seattle'},
                {id: 'Dallas', name: 'Dallas'}
            ],
            selectedOption: [{id: 'Boston', name: 'Boston'}]
        };

        $scope.duringEntries  = {
            availableOptions: [
                {id: '1h', name: 'Last hour'},
                {id: '6h', name: 'Last 6 hours'},
                {id: '12h', name: 'Last 12 hours'},
                {id: '24h', name: 'Last day'},
                {id: 'w', name: 'Last week'},
                {id: 'm', name: 'Last month'}
            ],
            selectedOption: {id: '1h', name: 'Last hour'}
        };

        function parseNodes(data){
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
        }
        function parseNodesByAz(data){
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
        }
        function parseServices (data){
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
        }
    }
]);



