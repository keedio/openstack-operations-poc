/**
 * Created by davidsantamaria on 17/2/17.
 */
var app = angular.module('refreshDashboard', [
    'ngRoute',
    'nodes.service'
]);


app.component('refreshDashboard',{
    templateUrl: 'refresh-dashboard/refresh.dashboard.template.html',
    controller: ['NodesService','ServicesService','$scope','$compile',
        function RefreshDashboardController (NodesService, ServicesService,$scope,$compile) {
            var self = this;
            $scope.refreshNodes = function(nodeType,objectRegions,during) {

                    var regions = []
                    jQuery.each(objectRegions,function (i,region) {
                        if(region.id != undefined) regions.push(region.id)
                        else  regions.push(region)
                    });
                    if (regions.length ==1) regions.push(regions[0]);

                    NodesService.GetNodesBy(during, nodeType,regions).then(function (data) {
                        self.regions = parseNodes(data);
                    });
                    NodesService.GetNodesAzBy(during, nodeType,regions).then(function (data) {
                        self.azones = parseNodesByAz(data);
                    });
                }
            $scope.refreshServices = function refresh(during) {
                ServicesService.GetServicesBy(during).then(function (data) {
                    self.services = parseServices(data);
                });
            }
            $scope.refreshGraph = function refresh(during,region) {
                ServicesService.GetStackedServicesBy(during,region).then(function (data) {
                    self.stackedServices = parseData(data);
                    createChart(self, during,$compile);
                });
            }


        }]
});