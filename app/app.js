
'use strict';

var app = angular.module("openStackApp",
    ['ngResource', 'ngRoute', 'services.service',
        'nodes.service', 'refreshDashboard', 'monitorComponent',
        'dashboardLayout','stackedServices','rawLogs']) ;

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        $routeProvider.
        when('/', {
            template: '<monitor-component></monitor-component>',

        }).
        when('/index', {
            template: '<monitor-component></monitor-component>',

        }).
        when('/stacked_bars', {
            template: '<stacked-services></stacked-services>',

        }).
        when('/rawlogs', {
            template: '<raw-logs></raw-logs>',

        }).
        otherwise('/');
    }
]);

