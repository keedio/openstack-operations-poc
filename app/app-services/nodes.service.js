/**
 * Created by davidsantamaria on 16/2/17.
 */

'use strict';

var app = angular.module('nodes.service', ['ngResource']);
    app.factory('NodesService',[  '$http','$q', Service]);

    function Service($http,$q) {
        var service = {};

        service.GetNodesBy = GetNodesBy;
        service.GetNodesAzBy = GetNodesAzBy;


        return service;

        function GetNodesBy(during, nodeType,regions) {
            return $http({
                url: '/nodes/getNodesBy',
                method: "GET",
                params: {during: during, nodeType: nodeType, regions: regions}
            }).then(handleSuccess, handleError);


        }

        function GetNodesAzBy(during, nodeType,regions) {
            return $http({
                url: '/nodes/getNodesAzBy',
                method: "GET",
                params: {during: during, nodeType: nodeType, regions: regions}
            }).then(handleSuccess, handleError);

        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }


