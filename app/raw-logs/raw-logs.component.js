/**
 * Created by davidsantamaria on 20/2/17.
 */

'use strict';

var app = angular.module('rawLogs', [
    'ngRoute',
    'raw.logs.service'
]);

app.component('rawLogs',{
    templateUrl: 'raw-logs/raw-logs.template.html',
    controller: ['RawLogsService',
        function RawLogsController (RawLogsService) {
            var self = this;

            self.nodeType  = {
                availableOptions: [
                    {id: -1, name: 'Nothing selected'},
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
                ]
            };
            self.logLevel  = {
                availableOptions: [
                    {id: -1, name: 'Nothing selected'},
                    {id: 'ERROR', name: 'Error'},
                    {id: 'INFO', name: 'Info'},
                    {id: 'WARNING', name: 'Warning'}
                ]
            };
            self.regionEntries  = {
                availableOptions: [
                    {id: -1, name: 'Nothing selected'},
                    {id: 'boston', name: 'Boston'},
                    {id: 'seattle', name: 'Seattle'},
                    {id: 'dallas', name: 'Dallas'}
                ]
            };
            self.servicesEntries  = {
                availableOptions: [
                    {id: -1, name: 'Nothing selected'},
                    {id: 'Ceilometer', name: 'Ceilometer'},
                    {id: 'Keystone', name: 'Keystone'},
                    {id: 'Neutron', name: 'Neutron'},
                    {id: 'Nova2', name: 'Nova2'}
                ]
            };

            self.payLoad = "";
            self.dateFrom = "";
            self.dateTo = "";
            self.pageStates = [];
            self.actualIndex = 0;
            self.activeFilters= {};

            $('#tabbedList').css('display','none');
            $('#refreshDiv').css('display','none');
          

            self.getRawLogsBy = function  () {
                var filters = serializeForm();
                RawLogsService.GetRawLogsBy(filters, undefined).then(function ( data) {
                    self.rawlogs =  data.result;
                    self.pageStates = [];
                    self.pageStates.push(undefined);
                    self.actualIndex = 1;
                    self.pageStates.push(data.pageState);
                    
                    self.activeFilters = getActiveFilters(filters);

                });
            }

            self.next = function () {

                RawLogsService.GetRawLogsBy(serializeForm(), self.pageStates[self.actualIndex]).then(function (data) {
                    self.rawlogs =  data.result;
                    if(self.pageStates.indexOf(data.pageState) == -1) {
                        self.pageStates.push(data.pageState);

                    }
                    self.actualIndex += 1;

                });

            }

            self.previous = function () {

                RawLogsService.GetRawLogsBy(serializeForm(), self.pageStates[self.actualIndex-2]).then(function (data) {
                    self.rawlogs =  data.result;
                    self.actualIndex -= 1;
                });

            }

            self.loglevelClass = function(loglevel) {

                return loglevel === 'ERROR' ? "pficon pficon-error-circle-o" : loglevel === 'WARNING' ?  "pficon pficon-warning-triangle-o " : "pficon pficon-ok";
            }

            self.removeFilter = function(filter ) {

                switch(filter) {
                    case 'loglevel':
                        self.logLevel.selectedOption = undefined;
                        $("#loglevelSelect").selectpicker('val', -1);
                        break;
                    case 'service':
                        self.servicesEntries.selectedOption = undefined;
                        $("#serviceSelect").selectpicker('val', -1);
                        break;
                    case 'region':
                        self.regionEntries.selectedOption = undefined;
                        $("#regionSelect").selectpicker('val', -1);
                        break;
                    case 'node_type':
                        self.nodeType.selectedOption = undefined;
                        $("#node_typeSelect").selectpicker('val', -1);
                        break;
                    case 'date':
                        self.dateFrom = '';
                        self.dateTo = '';
                        break;
                    case 'payload':
                        self.payLoad = '';
                        break;
                }
                self.getRawLogsBy();

            }

            self.export = function  () {
                var filters = serializeForm();
                RawLogsService.ExportRawLogs(filters).then(function ( report) {
                    var blob = new Blob([report], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    var objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl);
                });
            }

            function splitSelectedOtions(data) {

                var array = []
                for (var i in data)
                    array.push(  data[i].id )
                return array
            }

            function serializeForm(){
                return  {
                    node_type : self.nodeType.selectedOption != undefined  && self.nodeType.selectedOption != '' ? splitSelectedOtions(self.nodeType.selectedOption) : undefined,
                    loglevel : self.logLevel.selectedOption != undefined && self.logLevel.selectedOption != '' ? splitSelectedOtions(self.logLevel.selectedOption) : undefined,
                    region : self.regionEntries.selectedOption != undefined && self.regionEntries.selectedOption != '' ? splitSelectedOtions(self.regionEntries.selectedOption) : undefined,
                    service : self.servicesEntries.selectedOption != undefined && self.servicesEntries.selectedOption != ''? splitSelectedOtions(self.servicesEntries.selectedOption) : undefined,
                    payload : self.payLoad != '' ? self.payLoad : undefined,
                    date : self.dateFrom != '' &&  self.dateTo != '' ? [  self.dateFrom , self.dateTo ] : undefined

                };
            }

            function getActiveFilters(filters){
                var ret = [];
                for (var filter in filters )
                    if(filters[filter] != undefined && filters[filter] != '') ret.push({"name": filter, "values": filters[filter].toString()})

                return ret;
            }

        }]
});

app.directive('selectRawLogsGroup', selectDirective);

function selectDirective($timeout) {
	return {
		restrict : 'E',
		templateUrl : 'raw-logs/select.template.html',

		link : function(scope, element) {
			$timeout(function() {
				$('.selectpicker').selectpicker();
			});
		}
	}
}
