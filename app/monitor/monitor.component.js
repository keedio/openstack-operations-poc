/**
 * Created by davidsantamaria on 17/2/17.
 */
'use strict';

var app = angular.module('monitorComponent', [
    'ngRoute',
    'monitorNodes',
    'monitorServices'
]);

app.component('monitorComponent',{
    templateUrl: 'monitor/monitor.template.html',
    controller:[ function () {
        $('#tabbedList').removeAttr("style");
        $('#refreshDiv').removeAttr("style");
        $('#liNodes').removeAttr("style");
    }]
});