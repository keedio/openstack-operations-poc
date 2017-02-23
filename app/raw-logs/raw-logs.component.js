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

            $('#tabbedList').css('display','none');
            $('#refreshDiv').css('display','none');

            self.nodeType  = {
                availableOptions: [
                    {id: -1, name: 'Nothing selected'},
                    {id: 'compute', name: 'Compute'},
                    {id: 'storage', name: 'Storage'}
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
                    {id: 'Glance', name: 'Glance'},
                    {id: 'Keystone', name: 'Keystone'},
                    {id: 'Neutron', name: 'Neutron'},
                    {id: 'Nova', name: 'Nova'},
                    {id: 'Pacemaker', name: 'Pacemaker'},
                    {id: 'Storage', name: 'Storage'},

                ]
            };
            self.payLoad = "";
            self.dateFrom = "";
            self.dateTo = "";

            self.pageStates = [];
            self.actualIndex = 0;
            self.getRawLogsBy = function  () {

                RawLogsService.GetRawLogsBy(serializeForm(), undefined).then(function (data) {
                    self.rawlogs =  data.result;
                    self.pageStates = [];
                    self.pageStates.push(undefined);
                    self.actualIndex = 1;
                    self.pageStates.push(data.pageState);
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

            function splitSelectedOtions(data) {

                var array = []
                for (var i in data)
                    array.push(  data[i].id )
                return array
            }

            function serializeForm(){
                return  {
                    node_type : self.nodeType.selectedOption != undefined ? splitSelectedOtions(self.nodeType.selectedOption) : undefined,
                    loglevel : self.logLevel.selectedOption != undefined ? splitSelectedOtions(self.logLevel.selectedOption) : undefined,
                    region : self.regionEntries.selectedOption != undefined ? splitSelectedOtions(self.regionEntries.selectedOption) : undefined,
                    service : self.servicesEntries.selectedOption != undefined ? splitSelectedOtions(self.servicesEntries.selectedOption) : undefined,
                    payload : self.payLoad != '' ? self.payLoad : undefined,
                    date : self.dateFrom != '' &&  self.dateTo != '' ? [  self.dateFrom , self.dateTo ] : undefined

                };
            }

        }]
});
