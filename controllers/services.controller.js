/**
 * Created by davidsantamaria on 16/2/17.
 */
var express = require('express');
var router = express.Router();
var servicesService = require('services/nodes.service');


router.get('/getServicesBy', getServicesBy);
router.get('/stacked/stackedServices', stackedServices);


module.exports = router;


function getServicesBy(req, res) {
    servicesService.getServicesBy(req.param('during'))
        .then(function (data) {
            if (token) {
                res.json(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function stackedServices(req, res) {
    servicesService.stackedServices(req.param('during'),req.param('region'))
        .then(function (data) {
            if (token) {
                res.json(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}