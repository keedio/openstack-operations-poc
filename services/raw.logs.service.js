/**
 * Created by davidsantamaria on 20/2/17.
 */
var client = require('./../cassandra.config.js');
var Q = require('q');

var service = {};

service.getRawLogsBy = getRawLogsBy;

module.exports = service;

function getRawLogsBy(filters, pageState){
    var deferred = Q.defer();
    var query = generateLuceneQuery(filters);
    var options = pageState == undefined ? { prepare : true, fetchSize : 10 } : { pageState : pageState ,prepare : true, fetchSize : 10 };
    var rows = [];
    client.eachRow(query, "" ,options, function (n, row) {
        rows.push(row);
        }, function (err, result) {
            if (err) {
                console.log(query, "No results");
                deferred.resolve();
            } else
                deferred.resolve({result: rows, pageState : result.pageState} );
        }
    );
    return deferred.promise;

};




function generateLuceneQuery (filters){
    filters = JSON.parse(filters)
    var ret = "SELECT *  FROM raw_logs WHERE expr(raw_lucene_index, '{";
    var filter = "filter :[";
    var query = "";
    for (var data in filters) {
        if (data == "date")
            filter +=  '{type: "range", field: "log_ts", lower: "'+ new Date(filters[data][0]).toISOString().substr(0,10)+'", upper: "'+ new Date(filters[data][1]).toISOString().substr(0,10) +'" },'
        else if (data == 'payload')
            query += ', query :{ field:"payload",type:"phrase",value: "'+ filters[data] + '"}'
        else
            filter +=  '{type: "contains", field: "'+ data + '", values: ['+ parseValues(filters[data]) +'] },'


    }
    filter = filter.slice(0, -1) +  "]";
    ret += filter+ query + " }')";
    return ret;
}

function parseValues (values){
    var cad = '"' + values [0] + '"'
    for (var i = 1; i< values.length; i++)
        cad += ',"' + values [i] + '"'
    return cad;
}


