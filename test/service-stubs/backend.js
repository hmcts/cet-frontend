'use strict';

const config = require('app/config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const persistenceServicePort = config.services.backend.port;


router.get("/backend/load-case-data", (req, res) => {
    const data = require(`test/data/basic-path`);
    res.send(data);
});

app.use(router);

logger.info(`Listening on: ${persistenceServicePort}`);

const server = app.listen(persistenceServicePort);

module.exports = server;
