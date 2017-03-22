/**
 * Created by davidsantamaria on 16/2/17.
 */

'use strict';

var app = angular.module('monitorNodes', [
	'ngRoute',
	'nodes.service'
]);

app.component('monitorNodes', {
	templateUrl : 'monitor/monitor-nodes/monitor-nodes.template.html',
	controller : [ 'NodesService', '$rootScope',
		function MonitorNodesController(NodesService, $rootScope) {
			var self = this;

			initController();


			self.logEntries = {
				availableOptions : [
					{
						id : 'overcloud-controller-1',
						name : 'Controller 1'
					},
					{
						id : 'overcloud-compute-1',
						name : 'Compute 1'
					},
					{
						id : 'overcloud-compute-2',
						name : 'Compute 2'
					},
					{
						id : 'overcloud-compute-4',
						name : 'Compute 4'
					}
				],
				selectedOption : {
					id : 'overcloud-controller-1',
					name : 'Controller 1'
				}
			};

			self.regionEntries = {
				availableOptions : [
					{
						id : 'boston',
						name : 'Boston'
					},
					{
						id : 'seattle',
						name : 'Seattle'
					},
					{
						id : 'dallas',
						name : 'Dallas'
					}
				],
				selectedOption : [ {
					id : 'boston',
					name : 'Boston'
				} ]
			};

			self.duringEntries = {
				availableOptions : [
					{
						id : '1h',
						name : 'Last hour'
					},
					{
						id : '6h',
						name : 'Last 6 hours'
					},
					{
						id : '12h',
						name : 'Last 12 hours'
					},
					{
						id : '24h',
						name : 'Last day'
					},
					{
						id : '1w',
						name : 'Last week'
					},
					{
						id : '1m',
						name : 'Last month'
					}
				],
				selectedOption : {
					id : '1h',
					name : 'Last hour'
				},
				link : function(scope, element, attrs, ctrl) {
					$timeout(function() {
						element.selectpicker();
					});
				}
			};

			$rootScope.$on('refreshRegions', function(event, args) {
				
				self.regions = parseNodes(args);			
				
			});
			$rootScope.$on('refreshAzones', function(event, args) {
				self.azones = parseNodesByAz(args);
			});
		
			function initController() {
				NodesService.GetNodesBy('1h', 'compute', [ 'boston', 'boston' ])
					.then(function(data) {
						self.regions = parseNodes(data);

					});
				NodesService.GetNodesAzBy('1h', 'compute', [ 'boston', 'boston' ]).then(function(data) {
					self.azones = parseNodesByAz(data);
				});


			}
			self.updateNodes = function refresh(nodeType, objectRegions, during) {
				
				if(objectRegions.length == 0){
					self.regions = undefined;
					self.azones = undefined;
					return;
				} 
				
				var regions = []
				activeDivs = $('#monitorNodes').find('.panel-collapse.collapse.in');
				
				jQuery.each(objectRegions, function(i, region) {
					if (region.id != undefined) regions.push(region.id)
					else regions.push(region)
				});
				if (regions.length == 1) regions.push(regions[0]);
				 
				NodesService.GetNodesBy(during, nodeType, regions).then(function(data) {
					self.regions = parseNodes(data);
				});
				NodesService.GetNodesAzBy(during, nodeType, regions).then(function(data) {
					self.azones = parseNodesByAz(data);
				});
			}
			self.asignCollapseClass = function (az){				
				return activeDivs != undefined &&  activeDivs.filter ((i,div) => div.id == az).length > 0 ? 'panel-collapse collapse in': 'panel-collapse collapse';			
			}
			self.asignCollapseIconClass = function (az){				
				return activeDivs != undefined &&  activeDivs.filter ((i,div) => div.id == az).length > 0 ? 'ng-binding': 'collapsed';			
			}
	} ]
});

app.directive('selectMonitorNodesGroup', selectDirective);

function selectDirective($timeout) {
	return {
		restrict : 'E',
		templateUrl : 'monitor/monitor-nodes/select.template.html',

		link : function(scope, element) {
			$timeout(function() {
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