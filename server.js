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
    executeQuery("select group_and_count(region,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '1h' and region = 'Boston' and node_type = 'compute'",res);
});

app.get('/getNodesByAz',function(req,res){
    executeQuery("select group_and_count2(region,az,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '1h' and region = 'Boston' and node_type = 'compute'",res);
});

app.get('/getServices',function(req,res){
    executeQuery("select  group_and_count2(service,region,loglevel) as result from counters_services where  id = '1h' " ,res);
});

app.get('/getNodesBy',function(req,res){
    var during = req.param('during');
    var nodeType = req.param('nodeType');
    var regions =  splitRegions(req.param('regions'));

    executeQuery("select group_and_count(region,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '" + during + "' and node_type = '" + nodeType+ "' and region in "+ regions,res);
});

app.get('/getNodesAzBy',function(req,res){
    var during = req.param('during');
    var nodeType = req.param('nodeType');
    var regions = splitRegions(req.param('regions'));
    executeQuery("select group_and_count2(region,az,loglevel) as result from counters_nodes where loglevel in ('ERROR','WARN','INFO')and id = '" + during + "' and node_type = '" + nodeType+ "' and region in "+ regions,res);
});

app.get('/getServicesBy',function(req,res){
    var during = req.param('during');
    executeQuery("select  group_and_count2(service,region,loglevel) as result from counters_services where  id = '" + during + "'",res);
});

app.get('/stacked/stackedServices',function(req,res){
    var during = req.param('during');
    var region =  req.param('region');
    if (region == "all")
        executeQuery("select group_and_count2(service,loglevel,timeframe) as result from stack_services  where  id = '" + during + "'",res);
    else
        executeQuery("select group_and_count2(service,loglevel,timeframe) as result from stack_services where id = '" + during + "' and service in ('Keystone', 'Nova', 'Pacemaker', 'Neutron')  and loglevel in ('INFO','WARN','ERROR') and region = '"+ region + "'",res);

});

function executeQuery(query,res){
    client.execute(query, function (err, result) {
        if (err) {
            console.log(query, "No results");
            res.end();
        } else {
            var rows = result.rows;
            res.json(rows);
        }

    });
}

function splitRegions(data) {

    var cad = "('" + data[0] + "'"
    for (var i = 1; i < data.length; i++)
        cad += ",'" + data[i] + "'"

    cad += ")"
    return cad
}

app.get('/*', function  (req, res) {
    res.status(404, {status: 'not found'});
    res.end();
});

app.listen(3000, function(){
    console.log("Server ready at http://localhost:3000");
});
