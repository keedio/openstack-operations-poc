# OpenStack Operations

Web project implemented with NodeJS + ExpressJS + Cassandra + AngularJS + Patternfly.
It shows stored data in C*, about the OpenStack server's logs.
Consists of:
* A level logs dashboard by servie and nodes
* StackedBars charts
* Raw logs search

## Arquitecture

* NodeJS v6.9.5
* Cassandra 3.0.10
* AngularJS v1.5.11
* ExpressJS V4.14.1
* Patternfly 

## Deployment

To run this project, execute:

1. Install node packages
```shell
npm install
```
2. Install bower packages
```shell
bower install
```
3. Start node server
```shell
node server.js
```
4. Open your browser and type -> localhost:3000



