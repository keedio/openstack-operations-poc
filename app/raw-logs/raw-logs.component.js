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

            self.getRawLogsBy = function  () {
                   RawLogsService.GetRawLogsBy().then(function (data) {
                    self.rawlogs =  data;
                });
            }
            self.loglevelClass = function(loglevel) {

                return loglevel === 'ERROR' ? "pficon pficon-error-circle-o" : loglevel === 'WARNING' ?  "pficon pficon-warning-triangle-o " : "pficon pficon-ok";
            }




        }]
});
