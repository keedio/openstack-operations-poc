/**
 * Created by davidsantamaria on 16/2/17.
 */

'use strict';

var app = angular.module('monitorNodes', [
    'ngRoute',
    'nodes.service'
]);

    app.component('monitorNodes',{
        templateUrl: 'monitor/monitor-nodes/monitor-nodes.template.html',
        controller: ['NodesService',
            function MonitorNodesController (NodesService) {
                var self = this;

                initController();


                self.logEntries  = {
                    availableOptions: [
                        {id: 'compute', name: 'Compute'},
                        {id: 'storage', name: 'Storage'}
                    ],
                    selectedOption: {id: 'compute', name: 'Storage'}
                };

                self.regionEntries  = {
                    availableOptions: [
                        {id: 'Boston', name: 'Boston'},
                        {id: 'Seattle', name: 'Seattle'},
                        {id: 'Dallas', name: 'Dallas'}
                    ],
                    selectedOption: [{id: 'Boston', name: 'Boston'}]
                };

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
                    NodesService.GetNodesBy('1h','compute',['Boston','Boston'])
                        .then(function (data) {
                        parseNodes(data);
                    });
                    NodesService.GetNodesAzBy('1h','compute',['Boston','Boston']).then(function (data) {
                        parseNodesByAz(data);
                    });
                }
                self.updateNodes = function refresh(nodeType,objectRegions,during) {

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

        }]
    });

app.directive('selectMonitorNodesGroup', selectDirective);

function selectDirective($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'monitor/monitor-nodes/select.template.html',

        link: function (scope, element) {
            $timeout(function () {
                $('.selectpicker').selectpicker();
            });
        }
    }
}