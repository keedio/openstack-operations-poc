var express = require('express');
var  http = require('http');


/* setting static html to be used*/
var app = express().use(express.static('app'));

app.use('/services', require('./controllers/services.controller'));
app.use('/nodes', require('./controllers/nodes.controller'));
app.use('/rawlogs', require('./controllers/raw.logs.controller'));

app.get('/*', function  (req, res) {
    res.status(404, {status: 'not found'});
    res.end();
});

app.listen(3000, function(){
    console.log("Server ready at http://localhost:3000");
});
