/**
 * Created by davidsantamaria on 20/2/17.
 */
var cassandra=require("cassandra-driver");
var client =new cassandra.Client({'contactPoints':['10.129.135.122'],keyspace:'redhatpoc'});

/*
 * process.env.CASSANDRA_SERVICE
 * 10.129.135.122
*/
module.exports = client;