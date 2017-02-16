/**
 * Created by davidsantamaria on 16/2/17.
 */
var cassandra=require("cassandra-driver");
var client =new cassandra.Client({'contactPoints':['127.0.0.1'],keyspace:'redhatpoc'});
var Q = require('q');

var service = {};

service.getServicesBy = getServicesBy;
service.stackedServices = stackedServices;

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

function stackedServices(during,region){
    var deferred = Q.defer();
    var query =  region == "all" ? "select group_and_count3(service,loglevel,timeframe) as result from stack_services  where  id = '" + during + "'"
                :"select group_and_count3(service,loglevel,timeframe) as result from stack_services where id = '" + during + "' and service in ('Keystone', 'Nova', 'Pacemaker', 'Neutron')  and loglevel in ('INFO','WARN','ERROR') and region = '"+ region + "'" ;
    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            deferred.resolve();
        } else
            deferred.resolve(result.rows);
    });
    return deferred.promise;
};

