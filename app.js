'use strict';

/* eslint no-console: 0 no-unused-vars: 0 */

const logger = require('app/components/logger');
const path = require('path');
const express = require('express');
const session = require('express-session');
const nunjucks = require('nunjucks');
const routes = require(`${__dirname}/app/routes`);
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require(`${__dirname}/app/config`);
const utils = require(`${__dirname}/app/components/utils`);
const packageJson = require(`${__dirname}/package`);
const helmet = require('helmet');
const csrf = require('csurf');
const healthcheck = require(`${__dirname}/app/healthcheck`);
const appInsights = require('applicationinsights');
const commonContent = require('app/resources/en/translation/common');
const uuidv4 = require('uuid/v4');
const uuid = uuidv4();

exports.init = function () {
    const app = express();
    const port = config.app.port;
    const releaseVersion = packageJson.version;
    const username = config.app.username;
    const password = config.app.password;
    const useAuth = config.app.useAuth.toLowerCase();
    const useHttps = config.app.useHttps.toLowerCase();

    if (config.appInsights.instrumentationKey) {
        appInsights.setup(config.appInsights.instrumentationKey);
        appInsights.start();
    }

    // Authenticate against the environment-provided credentials, if running
    // the app in production (Heroku, effectively)
    if (useAuth === 'true') {
        app.use(utils.basicAuth(username, password));
    }

    // Application settings
    app.set('view engine', 'html');

    // Set up App
    const appViews = [
        path.join(__dirname, '/node_modules/govuk-frontend/'),
        path.join(__dirname, '/node_modules/govuk-frontend/components'),
        path.join(__dirname, '/node_modules/govuk_template_jinja/views/layouts'),
        path.join(__dirname, '/app/views/'),
        path.join(__dirname, '/app/steps/')
    ];

    const globals = {
        'currentYear': new Date().getFullYear(),
        'links': config.links,
        'helpline': config.helpline,
        'nonce': uuid
    };

    const nunjucksAppEnv = nunjucks.configure(appViews, {
        autoescape: true,
        express: app,
        noCache: true,
        watch: true,
        globals: globals
    });

    const filters = require('app/components/filters.js');

    filters(nunjucksAppEnv);

    // Middleware to serve static assets
    app.use('/public', express.static(path.join(__dirname, '/public')));
    app.use('/assets',
        express.static(path.join(__dirname, 'node_modules', 'govuk-frontend', 'assets')));

    // Serve govuk-frontend in /public
    app.use('/node_modules/govuk-frontend',
        express.static(path.join(__dirname, '/node_modules/govuk-frontend')));

    app.enable('trust proxy');

    // Security library helmet to verify 11 smaller middleware functions
    app.use(helmet());

    // Content security policy to allow just assets from same domain
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ['\'self\''],
            fontSrc: ['\'self\' data:'],
            scriptSrc: [
                '\'self\'',
                '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'',
                '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                'www.google-analytics.com',
                `'nonce-${uuid}'`
            ],
            connectSrc: ['\'self\''],
            mediaSrc: ['\'self\''],
            frameSrc: ['\'none\''],
            imgSrc: ['\'self\'', 'www.google-analytics.com'],
            frameAncestors: ['\'self\'']
        },
        browserSniff: true,
        setAllHeaders: true
    }));
    // Http public key pinning
    app.use(helmet.hpkp({
        maxAge: 900,
        sha256s: ['AbCdEf123=', 'XyzABC123=']
    }));

    // Referrer policy for helmet
    app.use(helmet.referrerPolicy({
        policy: 'origin'
    }));

    app.use(helmet.noCache());

    app.use(helmet.xssFilter({setOnOldIE: true}));

    // Middleware to serve static assets
    app.use('/public/stylesheets', express.static(`${__dirname}/public/stylesheets`));
    app.use('/public/images', express.static(`${__dirname}/app/assets/images`));
    app.use('/public/javascripts', express.static(`${__dirname}/app/assets/javascripts`));
    app.use('/public/pdf', express.static(`${__dirname}/app/assets/pdf`));
    app.use('/public', express.static(`${__dirname}/node_modules/govuk_template_jinja/assets`));
    app.use('/public', express.static(`${__dirname}/node_modules/govuk_frontend_toolkit`));
    app.use('/public/images/icons',
        express.static(`${__dirname}/node_modules/govuk_frontend_toolkit/images`));

    // Elements refers to icon folder instead of images folder
    app.use(favicon(path.join(__dirname, 'node_modules', 'govuk_template_jinja', 'assets', 'images',
        'favicon.ico')));

    // Support for parsing data in POSTs
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());

    // Send assetPath to all views
    app.use((req, res, next) => {
        res.locals.asset_path = '/public/';
        next();
    });

    // Support session data
    app.use(session({
        proxy: config.redis.proxy,
        resave: config.redis.resave,
        saveUninitialized: config.redis.saveUninitialized,
        secret: config.redis.secret,
        cookie: {
            httpOnly: config.redis.cookie.httpOnly,
            sameSite: config.redis.cookie.sameSite
        },
        store: utils.getStore(config.redis, session)
    }));

    app.use((req, res, next) => {
        req.session.cookie.secure = req.protocol === 'https';
        next();
    });

    app.use((req, res, next) => {
        if (!req.session) {
            return next(new Error('Unable to reach redis'));
        }
        next(); // otherwise continue
    });

    if (config.app.useCSRFProtection === 'true') {
        app.use(csrf(), (req, res, next) => {
            res.locals.csrfToken = req.csrfToken();
            next();
        });
    }

    // Add variables that are available in all views
    app.use(function (req, res, next) {
        res.locals.serviceName = commonContent.serviceName;
        res.locals.cookieText = commonContent.cookieText;
        res.locals.releaseVersion = `v${releaseVersion}`;
        next();
    });

    // Force HTTPs on production connections
    if (useHttps === 'true') {
        app.use(utils.forceHttps);
    }

    app.use('/health', healthcheck);

    app.use('/', (req, res, next) => {
        if (req.query.id && req.query.id !== req.session.regId) {
            delete req.session.form;
        }
        req.session.regId = req.query.id || req.session.regId || req.sessionID;
        next();
    }, routes);

    // Start the app
    const http = app.listen(port, () => {
        console.log(`Application started: http://localhost:${port}`);
    });

    app.all('*', (req, res) => {
        logger(req.sessionID)
            .error(`Unhandled request ${req.url}`);
        res.status(404)
            .render('errors/404', {common: commonContent});
    });

    app.use((err, req, res) => {
        logger(req.sessionID)
            .error(err);
        res.status(500)
            .render('errors/500', {common: commonContent});
    });

    return {app, http};
};
