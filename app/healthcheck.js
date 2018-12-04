'use strict';

const router = require('express').Router();
const os = require('os');
const commonContent = require('app/resources/en/translation/common');
const osHostname = os.hostname();

router.get('/', (req, res) => {
    return res.json({
        name: commonContent.serviceName,
        status: 'UP'
    });
});

module.exports = router;
module.exports.osHostname = osHostname;
