/**
 * Created by davidsantamaria on 16/2/17.
 */

'use strict';

var app = angular.module('stackedServices', [
    'ngRoute',
    'services.service'
]);

app.component('stackedServices',{
    templateUrl: 'stacked-bars/stacked-services/stacked-services.template.html',
    controller: ['ServicesService','$compile',
        function StackedServicesController (ServicesService,$compile) {
            var self = this;

            initController();

            self.regionEntries  = {
                availableOptions: [
                    {id: 'boston', name: 'Boston'},
                    {id: 'seattle', name: 'Seattle'},
                    {id: 'dallas', name: 'Dallas'},
                    {id: 'all', name: 'All regions'}
                ],
                selectedOption: {id: 'all', name: 'All regions'}
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
                selectedOption: {id: '1h', name: 'Last hour'}
            };


            function initController() {
                ServicesService.GetStackedServicesBy('1h','all').then(function (data) {
                    self.stackedServices = parseData(data);
                    createChart( self,'1h',$compile);
                });
            }
            self.updateGraph = function refresh(during,region) {
                ServicesService.GetStackedServicesBy(during,region).then(function (data) {
                    self.stackedServices = parseData(data);
                    createChart(self, during,$compile);
                });
            }


        }]
});

/*
*
* */

app.directive('selectStackedServicesGroup', selectDirective);

function selectDirective($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'stacked-bars/stacked-services/select.template.html',

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
        return 'Availability Zone '+ input.substr(2);
    }
});