/**
 * Created by davidsantamaria on 20/2/17.
 */
var client = require('./../cassandra.config.js');
var Q = require('q');

var service = {};

service.getRawLogsBy = getRawLogsBy;

module.exports = service;

function getRawLogsBy(){
    var deferred = Q.defer();
    var query = "select * from raw_logs limit 10;";
    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            deferred.resolve();
        } else
            deferred.resolve(result.rows);
    });
    return deferred.promise;

};


