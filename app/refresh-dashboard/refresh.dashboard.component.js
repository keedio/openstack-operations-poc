/**
 * Created by davidsantamaria on 17/2/17.
 */
var app = angular.module('refreshDashboard', [
    'ngRoute',
    'nodes.service'
]);


app.component('refreshDashboard',{
    templateUrl: 'refresh-dashboard/refresh.dashboard.template.html',
    controller: ['NodesService','ServicesService','$scope',
        function RefreshDashboardController (NodesService, ServicesService,$scope) {
            var self = this;
            $scope.refreshNodes = function(nodeType,objectRegions,during) {

                    var regions = []
                    jQuery.each(objectRegions,function (i,region) {
                        if(region.id != undefined) regions.push(region.id)
                        else  regions.push(region)
                    });
                    if (regions.length ==1) regions.push(regions[0]);

                    NodesService.GetNodesBy(during, nodeType,regions).then(function (data) {
                        parseNodes(data);
                    });
                    NodesService.GetNodesAzBy(during, nodeType,regions).then(function (data) {
                        parseNodesByAz(data);
                    });
                }
            $scope.refreshServices = function refresh(during) {
                ServicesService.GetServicesBy(during).then(function (data) {
                    parseServices(data);
                });
            }
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

                self.regions = regions;
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

                self.azones = azones;
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

                self.services = services;
            }

        }]
});