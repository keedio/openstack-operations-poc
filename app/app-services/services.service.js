/**
 * Created by davidsantamaria on 16/2/17.
 */

    'use strict';
var app = angular.module('services.service', ['ngResource']);
    app.factory('ServicesService', [  '$http','$q', Service]);

    function Service($http, $q) {
        var service = {};

        service.GetServicesBy = GetServicesBy;
        service.GetStackedServicesBy = GetStackedServicesBy;


        return service;

        function GetServicesBy(during) {
            return  $http({
                url: '/services/getServicesBy',
                method: "GET",
                params: {during: during}
            }).then(handleSuccess, handleError);
        }

        function GetStackedServicesBy(during,region) {
            return  $http({
                url: '/services/getStackedServicesBy',
                method: "GET",
                params: {during: during, region: region}
            }).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }


