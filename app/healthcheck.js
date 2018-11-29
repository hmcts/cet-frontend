'use strict';

const router = require('express').Router();
const os = require('os');
const Healthcheck = require('app/utils/Healthcheck');
const commonContent = require('app/resources/en/translation/common');
const gitRevision = process.env.GIT_REVISION;
const osHostname = os.hostname();

router.get('/', (req, res) => {
    const healthcheck = new Healthcheck();
    healthcheck.getDownstream(healthcheck.health, healthDownstream => {
        healthcheck.getDownstream(healthcheck.info, infoDownstream => {
            return res.json({
                name: commonContent.serviceName,
                // status: healthcheck.status(healthDownstream),
                status: 'UP',
                uptime: process.uptime(),
                host: osHostname,
                version: gitRevision,
                downstream: healthcheck.mergeInfoAndHealthData(healthDownstream, infoDownstream)
            });
        });
    });
});

module.exports = router;
module.exports.osHostname = osHostname;
