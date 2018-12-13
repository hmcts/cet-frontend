'use strict';

const config = {
    serviceName: 'cet_frontend',
    environment: process.env.REFORM_ENVIRONMENT || 'prod',
    nodeEnvironment: process.env.NODE_ENV || 'local',
    gitRevision: process.env.GIT_REVISION,
    frontendPublicHttpProtocol: process.env.PUBLIC_PROTOCOL || 'http',
    app: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        useAuth: process.env.USE_AUTH || 'false',
        useHttps: process.env.USE_HTTPS || 'false',
        useIDAM: process.env.USE_IDAM || 'false',
        port: process.env.PORT || '3000',
        useCSRFProtection: 'true'
    },
    services: {
        backend: {
            url: 'http://localhost:8080',
            port: '3001'
        },
        s2sAuth: {
            url: process.env.IDAM_S2S_URL || 'http://localhost:4502',
            secret: process.env.S2S_SECRET || 'AAAAAAAAAAAAAAAA'
        },
        idam: {
            loginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:3501/login',
            apiUrl: process.env.IDAM_API_URL || 'http://localhost:4501',
            roles: ['cet-private-beta', 'citizen'],
            oauth2: {
                secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_CET || 'AAAAAAAAAAAAAAAA',
                callback_path: '/oauth2/callback'
            },
        },
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,

        password: process.env.REDIS_PASSWORD || 'dummy_password',
        useTLS: process.env.REDIS_USE_TLS || 'false',
        enabled: process.env.USE_REDIS || 'false',
        secret: process.env.REDIS_SECRET || 'OVERWRITE_THIS',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true
        }
    },
    dateFormat: 'DD/MM/YYYY',
    utils: {
        api: {
            retries: process.env.RETRIES_NUMBER || 10,
            retryDelay: process.env.RETRY_DELAY || 1000
        }
    },
    endpoints: {
        health: '/health',
        info: '/info'
    },
    appInsights: {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY
    }
};

module.exports = config;
