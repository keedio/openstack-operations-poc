/**
 * Created by davidsantamaria on 16/2/17.
 */

    'use strict';
var app = angular.module('services.service', ['ngResource']);
    app.factory('ServicesService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetServicesBy = GetServicesBy;
        service.GetStackedServicesBy = GetStackedServicesBy;


        return service;

        function GetServicesBy() {
            return $http.get('/services/getNodesBy').then(handleSuccess, handleError);
        }

        function GetStackedServicesBy() {
            return $http.get('/services/getNodesAzBy').then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }


