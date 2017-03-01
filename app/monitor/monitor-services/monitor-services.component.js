/**
 * Created by davidsantamaria on 17/2/17.
 */

'use strict';

var app = angular.module('monitorServices', [
	'ngRoute',
	'services.service'
]);

app.component('monitorServices', {
	templateUrl : 'monitor/monitor-services/monitor-services.template.html',
	controller : [ 'ServicesService', '$rootScope',
		function MonitorServicesController(ServicesService, $rootScope) {
			var self = this;

			initController();

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

			$('#tabbedList').removeAttr("style");
			$('#refreshDiv').removeAttr("style");
			$('#liNodes').removeAttr("style");
			$('#liServices').removeClass('active');

			$rootScope.$on('refreshServices', function(event, args) {
				self.services = parseServices(args);
			});

			function initController() {
				ServicesService.GetServicesBy('1h').then(function(data) {
					self.services = parseServices(data);
				});
			}
			self.updateServices = function refresh(during) {
				activeDivs = $('#monitorNodes').find('.panel-collapse.collapse.in');
				ServicesService.GetServicesBy(during).then(function(data) {
					self.services = parseServices(data);
				});
			}
			self.asignCollapseClass = function (service){				
				return activeDivs != undefined &&  activeDivs.filter ((i,div) => div.id == service).length > 0 ? 'panel-collapse collapse in': 'panel-collapse collapse';			
			}
			self.asignCollapseIconClass = function (service){				
				return activeDivs != undefined &&  activeDivs.filter ((i,div) => div.id == service).length > 0 ? 'ng-binding': 'collapsed';			
			}

		} ]
});

app.directive('selectMonitorServicesGroup', selectDirective);

function selectDirective($timeout) {
	return {
		restrict : 'E',
		templateUrl : 'monitor/monitor-services/select.template.html',

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