
'use strict';

var app = angular.module("openStackApp",
    ['ngResource', 'ngRoute', 'services.service','nodes.service',
        'refreshDashboard', 'monitorComponent','dashboardLayout']) ;

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        $routeProvider.
        when('/', {
            template: '<monitor-nodes></monitor-nodes>',

        }).
        when('/nodes', {
            template: '<monitor-nodes></monitor-nodes>',

        }).
        when('/services', {
            template: '<monitor-services></monitor-services>',

        }).

        otherwise('/');
    }
]);

/*
app.factory('nodesBy', function ($resource){
    return $resource('/services/getNodesBy');
});

app.factory('nodesAzBy', function ($resource){
    return $resource('/services/getNodesAzBy');
});

app.factory('servicesBy', function ($resource){
    return $resource('/services/getServicesBy');
});

app.factory('stackedServicesBy', function ($resource){
    return $resource('/services/stackedServices');
});

app.controller('NodesController', ['$scope','nodesBy','nodesAzBy','servicesBy',
    function($scope,getNodesBy, getNodesAzBy, getServicesBy) {
        $scope.init=function(){
            getNodesBy.query({"during": '1h', "nodeType": 'compute', "regions": ['Boston','Boston']},
                function(data){
                    parseNodes(data);
                });

            getNodesAzBy.query({"during": '1h', "nodeType": 'compute', "regions": ['Boston','Boston']},
                function(data){
                    parseNodesByAz(data);
                });

            getServicesBy.query({"during": '1h'},
                function(data){
                    parseServices(data);
                });
        }
        $scope.refresh = function(logEntries,objectRegions,nodeDuring,servicesDuring){
           var regions = []
            jQuery.each(objectRegions,function (i,region) {
               if(region.id != undefined) regions.push(region.id)
               else  regions.push(region)
            });
            if (regions.length ==1) regions.push(regions[0]);
           getNodesBy.query({"during": nodeDuring, "nodeType": logEntries, "regions": regions},
                function(data){
                    parseNodes(data);
                });

            getNodesAzBy.query({"during": nodeDuring, "nodeType": logEntries, "regions": regions},
                function(data){
                    parseNodesByAz(data);
                });

            getServicesBy.query({"during": servicesDuring},
                function(data){
                    parseServices(data);
                });
        };
        $scope.logEntries  = {
            availableOptions: [
                {id: 'compute', name: 'Compute'},
                {id: 'storage', name: 'Storage'}
            ],
            selectedOption: {id: 'compute', name: 'Storage'}
        };

        $scope.regionEntries  = {
            availableOptions: [
                {id: 'Boston', name: 'Boston'},
                {id: 'Seattle', name: 'Seattle'},
                {id: 'Dallas', name: 'Dallas'}
            ],
            selectedOption: [{id: 'Boston', name: 'Boston'}]
        };

        $scope.duringEntries  = {
            availableOptions: [
                {id: '1h', name: 'Last hour'},
                {id: '6h', name: 'Last 6 hours'},
                {id: '12h', name: 'Last 12 hours'},
                {id: '24h', name: 'Last day'},
                {id: 'w', name: 'Last week'},
                {id: 'm', name: 'Last month'}
            ],
            selectedOption: {id: '1h', name: 'Last hour'}
        };

        function parseNodes(data){
            var regions = [];
            var sortedKeys = Object.keys(data[0].result).sort();
            for (var i = 0; i < sortedKeys.length; i++){
                var key = sortedKeys[i];
                var name = key.split(".");
                var value = data[0].result[key];

                if (i % 3 == 0)
                    regions.push ({"name":name[0], "info":0, "warning":0, "error":0}) ;

                name[1] == "ERROR" ? regions[regions.length-1].error = value : name[1] == "INFO" ? regions[regions.length-1].info = value : regions[regions.length-1].warning = value;
            }

            $scope.regions = regions;
        }
        function parseNodesByAz(data){
            var azones = [];
            var sortedKeys = Object.keys(data[0].result).sort();
            var regionName= "", azName = "";
            for (var i = 0; i < sortedKeys.length; i++){
                var key = sortedKeys[i];
                var name = key.split(".");
                var value = data[0].result[key];

                if (name[0] != regionName){
                    regionName = name[0];
                    azones.push ({"name":name[0], "regions":[] }) ;
                }

                if (name[1] != azName){
                    azName = name[1];
                    azones[azones.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
                }

                name[2] == "ERROR" ? azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].error = value : name[2] == "INFO" ? azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].info = value : azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].warning = value;
            }

            $scope.azones = azones;
        }
        function parseServices (data){
            var services = [];
            var sortedKeys = Object.keys(data[0].result).sort();
            var serviceName= "", regionName = "";
            for (var i = 0; i < sortedKeys.length; i++){
                var key = sortedKeys[i];
                var name = key.split(".");
                var value = data[0].result[key];

                if (name[0] != serviceName){
                    serviceName = name[0];
                    regionName = name[1];
                    services.push ({"name":name[0], "regions":[] }) ;
                    services[services.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
                }

                else if (name[1] != regionName){
                    regionName = name[1];
                    services[services.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
                }

                name[2] == "ERROR" ? services[services.length-1].regions[services[services.length-1].regions.length-1].error = value : name[2] == "INFO" ? services[services.length-1].regions[services[services.length-1].regions.length-1].info = value : services[services.length-1].regions[services[services.length-1].regions.length-1].warning = value;
            }

            $scope.services = services;
        }
    }
]);

 */
app.controller('StackedBarController', ['$scope','$compile','stackedServicesBy',
    function($scope,$compile,stackedServicesBy) {
        $scope.showGraphs = function(logEntries,region,during){
            stackedServicesBy.query({"during": during, "nodeType": logEntries, "region": region},
                 function(data){
                    parseData(data);
                    createChart(during);
             });
        };

        $scope.logEntries  = {
            availableOptions: [
                {id: 'compute', name: 'Compute'},
                {id: 'storage', name: 'Storage'}
            ],
            selectedOption: {id: 'compute', name: 'Storage'}
        };

        $scope.regionEntries  = {
            availableOptions: [
                {id: 'Boston', name: 'Boston'},
                {id: 'Seattle', name: 'Seattle'},
                {id: 'Dallas', name: 'Dallas'},
                {id: 'all', name: 'All regions'}
            ],
            selectedOption: {id: 'all', name: 'All regions'}
        };

        $scope.duringEntries  = {
            availableOptions: [
                {id: '1h', name: 'Last hour'},
                {id: '6h', name: 'Last 6 hours'},
                {id: '12h', name: 'Last 12 hours'},
                {id: '24h', name: 'Last day'},
                {id: 'w', name: 'Last week'},
                {id: 'm', name: 'Last month'}
            ],
            selectedOption: {id: '1h', name: 'Last hour'}
        };

        function parseData(data){
            var services = [];
            var sortedKeys = Object.keys(data[0].result).sort();
            var  serviceName = "";
            for (var i = 0; i < sortedKeys.length; i++){
                var key = sortedKeys[i];
                var name = key.split(".");
                var value = data[0].result[key];

                if (name[0] != serviceName){
                    serviceName = name[0];
                    services.push ({"name":name[0], "dataInf":['Info' ],  "dataError":['Error'],  "dataWar":['Warning']});
                }

                name[1] == "ERROR" ? services[services.length-1].dataError.push(value) :
                        name[1] == "INFO" ? services[services.length-1].dataInf.push(value):
                        services[services.length-1].dataWar.push(value);
            }

            $scope.stackedServices = services;
        }
        function createChart(during){
            $('#accordion-services').html('');
            jQuery.each($scope.stackedServices, function (i,service) {
                var divID = 'graph'+ service.name;
                var div = '<div class="panel panel-default">'  +
                   ' <div class="panel-heading">'  +
                    '<h4 class="panel-title">'  +
                    '<a data-toggle="collapse"  data-parent="#accordion-markup" href=  #'+ service.name +' class="collapsed">'  +
                    '' + service.name + '</a> </h4></div>'+
                   ' <div id="'+service.name+'" class="panel-collapse collapse">'  +
                    '<div class="panel-body">'  +
                    '<div class="row row-cards-pf">'  +
                    '<div class="col-xs-12 col-sm-6" id="' + divID + '"> </div></div></div> </div> </div> </div>';
                var element = angular.element(div);
                $compile(element)($scope);
                angular.element('#accordion-services').append(element);

                var config = {};
                config.bindto = '#'+divID;
                config.data  = {
                    columns: [service.dataError, service.dataWar,service.dataInf],
                    groups: [['Error', 'Warning', 'Info']],
                    type: 'bar',
                    order: null
                };
                config.axis = {
                    x: {
                        categories: generateChartLabels (during)
                        ,
                        type: 'category',
                        tick: {
                            multiline: false,
                            centered: true
                        }
                    }
                };
                config.size =  {
                    height: 320,
                    width: 500
                };
                config.color =  {
                    pattern: [
                        '#FC4A1A',
                        '#F7B733',
                        '#4ABDAC',
                    ]
                };
                c3.generate(config);

            });
        }
        function generateChartLabels (during){
            var date = new Date();
            switch(during) {
                case '1h':
                    return  [formatDateHour(new Date().setMinutes(new Date().getMinutes()-60)),formatDateHour(new Date().setMinutes(new Date().getMinutes()-45)),
                        formatDateHour(new Date().setMinutes(new Date().getMinutes()-30)), formatDateHour(new Date().setMinutes(new Date().getMinutes()-15)),formatDateHour (date)];
                case '6h':
                    return  [formatDateHour(new Date().setHours(new Date().getHours()-6)),formatDateHour(new Date().setHours(new Date().getHours()-5)),formatDateHour(new Date().setHours(new Date().getHours()-4)), formatDateHour(new Date().setHours(new Date().getHours()-3)),
                        formatDateHour(new Date().setHours(new Date().getHours()-2)),formatDateHour(new Date().setHours(new Date().getHours()-1)),formatDateHour(date)];
                case '12h':
                    return  [formatDateHour(new Date().setHours(new Date().getHours()-12)),formatDateHour(new Date().setHours(new Date().getHours()-11)),formatDateHour(new Date().setHours(new Date().getHours()-10)),formatDateHour(new Date().setHours(new Date().getHours()-9)),
                        formatDateHour(new Date().setHours(new Date().getHours()-8)), formatDateHour(new Date().setHours(new Date().getHours()-7)),
                        formatDateHour(new Date().setHours(new Date().getHours()-6)),formatDateHour(new Date().setHours(new Date().getHours()-5)),formatDateHour(new Date().setHours(new Date().getHours()-4)), formatDateHour(new Date().setHours(new Date().getHours()-3)),
                        formatDateHour(new Date().setHours(new Date().getHours()-2)),formatDateHour(new Date().setHours(new Date().getHours()-1)),formatDateHour(date)];
                case '24h':
                    return [formatDateDay(new Date().setHours(new Date().getHours()-24)), '' ,'','','','',formatDateHour(new Date().setHours(new Date().getHours()-18)), '' ,'','','','', formatDateHour(new Date().setHours(new Date().getHours()-12)),
                        '' ,'','','','',formatDateHour(new Date().setHours(new Date().getHours()-6)), '' ,'','','','',formatDateDay(date)];
                case 'w':
                    return [formatDateDay(new Date().setDate(new Date().getDate()-7)),formatDateDay(new Date().setDate(new Date().getDate()-6)),formatDateDay(new Date().setDate(new Date().getDate()-5)),
                        formatDateDay(new Date().setDate(new Date().getDate()-4)), formatDateDay(new Date().setDate(new Date().getDate()-3)),
                        formatDateDay(new Date().setDate(new Date().getDate()-2)),formatDateDay(new Date().setDate(new Date().getDate()-1)),formatDateDay(date)];
                case 'm':
                    return [formatDateDay(new Date().setMonth(new Date().getMonth()-1)), '' ,'','','',formatDateDay(new Date().setDate(new Date().getDate()-25)),'', '' ,'','',formatDateDay(new Date().setDate(new Date().getDate()-20)),'','',
                        '' ,'',formatDateDay(new Date().setDate(new Date().getDate()-15)),'','','', '' ,formatDateDay(new Date().setDate(new Date().getDate()-10)),'','','','',formatDateDay(new Date().setDate(new Date().getDate()-5)),'',
                    '','','',formatDateDay(date)];

            }
        }
        function formatDateHour(date){
            date = new Date (date)
            var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            return  hours + ':' + minutes;
        }
        function formatDateDay(date){
            date = new Date (date)
            var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            var month =  date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
            return month + '/' + day;
        }

    }
]);

