/**
 * Created by davidsantamaria on 20/2/17.
 */

var express = require('express');
var router = express.Router();
var rawLogServices = require('../services/raw.logs.service');


router.get('/getRawLogsBy', getRawLogsBy);
module.exports = router;


function getRawLogsBy(req, res) {
    rawLogServices.getRawLogsBy()
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