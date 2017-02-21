var client = require('./../cassandra.config.js');
var Q = require('q');

var service = {};

service.getNodesBy = getNodesBy;
service.getNodesAzBy = getNodesAzBy;

module.exports = service;


function getNodesBy(during,nodeType,regions){
    var deferred = Q.defer();
    regions = splitRegions(regions);
    var query = "select group_and_count(region,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '" + during + "' and node_type = '" + nodeType+ "' and region in "+ regions;
    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            deferred.resolve();
        } else
            deferred.resolve(result.rows);
    });
    return deferred.promise;
};

function getNodesAzBy(during,nodeType,regions){
    var deferred = Q.defer();
    regions = splitRegions(regions);
    var query = "select group_and_count2(region,az,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '" + during + "' and node_type = '" + nodeType+ "' and region in "+ regions;
    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            deferred.resolve();
        } else
            deferred.resolve(result.rows);
    });
    return deferred.promise;

};


function splitRegions(data) {

    var cad = "('" + data[0] + "'"
    for (var i = 1; i < data.length; i++)
        cad += ",'" + data[i] + "'"

    cad += ")"
    return cad
}
