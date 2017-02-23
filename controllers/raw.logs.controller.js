/**
 * Created by davidsantamaria on 20/2/17.
 */

var express = require('express');
var router = express.Router();
var rawLogServices = require('../services/raw.logs.service');
var excel = require('node-excel-export');


router.get('/getRawLogsBy', getRawLogsBy);
router.get('/exportRawLogs', exportRawLogs);
module.exports = router;


function getRawLogsBy(req, res) {
    rawLogServices.getRawLogsBy(req.query.filters, req.query.pageState, 10)
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



function exportRawLogs(req, res) {
    rawLogServices.getRawLogsBy(req.query.filters, undefined, 20000)
        .then(function (data) {
            if (data){
                var report = generateReport (data.result);
                res.attachment('raw_logs_report'+ new Date().toISOString() +'.xlsx');
                res.send(report);
            }

            else
                res.sendStatus(404);

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function generateReport(data){


    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    var specification = {
        loglevel: { // <- the key should match the actual data key
            displayName: 'Log Level', // <- Here you specify the column header
            headerStyle: styles.headerDark,
            width: 120
        },
        date: {
            displayName: 'Date',
            headerStyle: styles.headerDark,
            width: 150 // <- width in chars (when the number is passed as string)
        },
        service: {
            displayName: 'Service',
            headerStyle: styles.headerDark,
            width: 220 // <- width in pixels
        },
        region: {
            displayName: 'Region',
            headerStyle: styles.headerDark,
            width: 220 // <- width in pixels
        },
        node_type: {
            displayName: 'Node Type',
            headerStyle: styles.headerDark,
            width: 220 // <- width in pixels
        },
        payload: {
            displayName: 'Payload',
            headerStyle: styles.headerDark,
            width: 350 // <- width in pixels
        }
    }


    var report = excel.buildExport(
        [
            {
                name: 'Raw Logs',
                specification: specification,
                data: data
            }
        ]
    );

    return report;

}