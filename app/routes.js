'use strict';

const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const services = require('app/components/services');

router.all('*', (req, res, next) => {
    req.log = logger(req.sessionID);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    next();
});

router.use((req, res, next) => {
    if (!req.session.form) {
        req.session.form = {
            applicantEmail: req.session.regId
        };
        req.session.back = [];
    }

    if (!req.session.form.applicantEmail) {
        req.session.form.applicantEmail = req.session.regId;
    }

    next();
});

router.get('/', (req, res) => {
    services.loadCaseData(req.session.regId)
        .then(result => {
            if (result.name === 'Error') {
                req.log.debug('Failed to load user data');
                req.log.info({tags: 'Analytics'}, 'Application Started');
            } else {
                req.log.debug('Successfully loaded case data');
                req.session.form = result.formdata;
            }
            res.redirect('start');
        });
});

router.get('/', (req, res) => {
    res.redirect('start');
});

router.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

const steps = initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui/`]);

Object.entries(steps).forEach(([, step]) => {
    router.get(step.constructor.getUrl(), step.runner().GET(step));
    router.post(step.constructor.getUrl(), step.runner().POST(step));
});

module.exports = router;
