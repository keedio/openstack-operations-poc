/**
 * Created by davidsantamaria on 17/2/17.
 */

'use strict';

var app = angular.module('monitorServices', [
    'ngRoute',
    'services.service'
]);

app.component('monitorServices',{
    templateUrl: 'monitor/monitor-services/monitor-services.template.html',
    controller: ['ServicesService',
        function MonitorServicesController (ServicesService) {
            var self = this;

            initController();

            self.duringEntries  = {
                availableOptions: [
                    {id: '1h', name: 'Last hour'},
                    {id: '6h', name: 'Last 6 hours'},
                    {id: '12h', name: 'Last 12 hours'},
                    {id: '24h', name: 'Last day'},
                    {id: 'w', name: 'Last week'},
                    {id: 'm', name: 'Last month'}
                ],
                selectedOption: {id: '1h', name: 'Last hour'},
                link: function(scope, element, attrs, ctrl) {
                    $timeout(function() {
                        element.selectpicker();
                    });
                }
            };


            function initController() {
                ServicesService.GetServicesBy('1h').then(function (data) {
                    parseServices(data);
                });
            }
            self.updateServices = function refresh(during) {
                ServicesService.GetServicesBy(during).then(function (data) {
                    parseServices(data);
                });
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

app.directive('selectMonitorServicesGroup', selectDirective);

function selectDirective($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'monitor/monitor-services/select.template.html',

        link: function (scope, element) {
            $timeout(function () {
                $('.selectpicker').selectpicker();
            });
        }
    }
}