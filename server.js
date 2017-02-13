var express = require('express');
var  http = require('http');
var bodyParse=require('body-parser');
var cassandra=require("cassandra-driver");
var client =new cassandra.Client({'contactPoints':['127.0.0.1'],keyspace:'redhatpoc'});

/* setting static html to be used*/
var app = express().use(express.static('app'));

//useful functions
var counter=0;

/* Route Definations */
app.get('/getNodes',function(req,res){
    client.execute("select group_and_count(region,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '1h'", function (err, result) {
        if (err) {
            console.log("No results");
            res.end();
        } else {
            var rows = result.rows;
            res.json(rows);
        }

    });
});

app.get('/getNodesByAz',function(req,res){
    client.execute("select group_and_count2(region,az,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '1h'", function (err, result) {
        if (err) {
            console.log("No results");
            res.end();
        } else {
            var rows = result.rows;
            res.json(rows);
        }

    });
});

app.get('/getServices',function(req,res){
    client.execute("select  group_and_count2(service,region,loglevel) as result from counters_services where  id = '1h'", function (err, result) {
        if (err) {
            console.log("No results");
            res.end();
        } else {
            var rows = result.rows;
            res.json(rows);
        }

    });
});



app.get('/*', function  (req, res) {
    res.status(404, {status: 'not found'});
    res.end();
});

app.listen(3000, function(){
    console.log("Server ready at http://localhost:3000");
});
