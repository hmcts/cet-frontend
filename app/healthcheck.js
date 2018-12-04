'use strict';

const router = require('express').Router();
const os = require('os');
const osHostname = os.hostname();

router.get('/', (req, res) => {
    return res.json({
        status: 'UP'
    });
});

module.exports = router;
module.exports.osHostname = osHostname;
