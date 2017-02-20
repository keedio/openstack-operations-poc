/**
 * Created by davidsantamaria on 16/2/17.
 */
var express = require('express');
var router = express.Router();
var servicesService = require('../services/services.service');


router.get('/getServicesBy', getServicesBy);
router.get('/getStackedServicesBy', getStackedServicesBy);


module.exports = router;


function getServicesBy(req, res) {

    servicesService.getServicesBy(req.query.during )
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

function getStackedServicesBy(req, res) {

    servicesService.getStackedServicesBy(req.query.during ,req.query.region)
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