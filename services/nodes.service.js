/**
 * Created by davidsantamaria on 9/2/17.
 */
var config = require('config.json');
var Q = require('q');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client(config.contactPoints);
var service = {};

service.getRegionsInfo = getRegionsInfo;

module.exports = service;

function getRegionsInfo(type, regions, during) {

    client.connect()
        .then(function () {
            const query = 'SELECT name, time, currencies, value FROM examples.tuple_forex where name = ?';
            return client.execute(query, ['KEYSPACE'], { prepare: true });
        })
        .catch(function (err) {
            console.error('There was an error', err);
            return client.shutdown();
        });
}
