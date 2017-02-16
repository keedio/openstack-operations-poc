/**
 * Created by davidsantamaria on 16/2/17.
 */
/**
 * Created by davidsantamaria on 16/2/17.
 */
var express = require('express');
var router = express.Router();
var nodesService = require('../services/nodes.service');


router.get('/getNodesBy', getNodesBy);
router.get('/getNodesAzBy', getNodesAzBy);


module.exports = router;


function getNodesBy(req, res) {
    nodesService.getNodesBy(req.query.during ,req.query.nodeType,req.query.regions)
        .then(function (data) {
            if (data)
                res.send(data);
            else
                res.sendStatus(404);

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getNodesAzBy(req, res) {
    nodesService.getNodesAzBy(req.query.during ,req.query.nodeType,req.query.regions)
        .then(function (data) {
            if (data)
                res.send(data);
            else
                res.sendStatus(404);

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}