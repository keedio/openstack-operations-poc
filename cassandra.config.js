/**
 * Created by davidsantamaria on 20/2/17.
 */
var cassandra=require("cassandra-driver");
var client =new cassandra.Client({'contactPoints':[process.env.CASSANDRA_SERVICE],keyspace:'redhatpoc'});


module.exports = client;