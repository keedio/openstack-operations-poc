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
                        {id: 'boston', name: 'Boston'},
                        {id: 'seattle', name: 'Seattle'},
                        {id: 'dallas', name: 'Dallas'}
                    ],
                    selectedOption: [{id: 'boston', name: 'Boston'}]
                };

                self.duringEntries  = {
                    availableOptions: [
                        {id: '1h', name: 'Last hour'},
                        {id: '6h', name: 'Last 6 hours'},
                        {id: '12h', name: 'Last 12 hours'},
                        {id: '24h', name: 'Last day'},
                        {id: '1w', name: 'Last week'},
                        {id: '1m', name: 'Last month'}
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
                            self.regions =  parseNodes(data);
                    });
                    NodesService.GetNodesAzBy('1h','compute',['Boston','Boston']).then(function (data) {
                        self.azones = parseNodesByAz(data);
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
                        self.regions = parseNodes(data);
                    });
                    NodesService.GetNodesAzBy(during, nodeType,regions).then(function (data) {
                        self.azones = parseNodesByAz(data);
                    });
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

app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.filter('formalizeAzs', function() {
    return function(input) {
        return 'Availability Zone' + input.substr(2);
    }
});