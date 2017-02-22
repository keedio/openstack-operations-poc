/**
 * Created by davidsantamaria on 16/2/17.
 */
var client = require('./../cassandra.config.js');
var Q = require('q');

var service = {};

service.getServicesBy = getServicesBy;
service.getStackedServicesBy = getStackedServicesBy;

module.exports = service;


function getServicesBy(during){
    var deferred = Q.defer();
    var query = "select  group_and_count2(service,region,loglevel) as result from counters_services where  id = '" + during + "'";
    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            deferred.resolve();
        } else
            deferred.resolve(result.rows);
    });
    return deferred.promise;
};

function getStackedServicesBy(during,region){
    var deferred = Q.defer();
    var query =  region == "all" ? "select stack_services_grouping(id, service,loglevel, timeframe) as result from stack_services  where  id = '" + during + "' "
                :"select stack_services_grouping(id, service,loglevel, timeframe) as result from stack_services where id = '" + during + "'  and service in ('Keystone', 'Nova', 'Pacemaker', 'Neutron', 'Cinder','Glance')  and loglevel in ('INFO','WARN','ERROR') and region = '"+ region + "'"  ;

    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            deferred.resolve();
        } else
            deferred.resolve(result.rows);
    });
    return deferred.promise;
};

