'use strict';

const {URLSearchParams} = require('url');
const otp = require('otp');
const utils = require('app/components/api-utils');
const config = require('app/config');
const IDAM_SERVICE_URL = config.services.idam.apiUrl;
const BACKEND_SERVICE_URL = config.services.backend.url;
const SERVICE_AUTHORISATION_URL = `${config.services.s2sAuth.url}/lease`;
const SERVICE_NAME = config.services.s2sAuth.serviceName;
const S2S_SECRET = config.services.s2sAuth.secret;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const loadCaseData = (id, sessionID) => {
    logInfo('loadCaseData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    logInfo(`loadFormData url: ${BACKEND_SERVICE_URL}`);
    return utils.fetchJson(BACKEND_SERVICE_URL, fetchOptions);
};

const getFeeAmount = (userToken) => {
    logInfo('getFeeAmount');

    return authorise()
        .then(result => {
            if (result.name !== 'Error') {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': userToken,
                    'ServiceAuthorization': result
                };
                const fetchOptions = utils.fetchOptions({}, 'GET', headers);
                logInfo(`getFeeAmount url: ${BACKEND_SERVICE_URL}/fee`);
                return utils.fetchJson(`${BACKEND_SERVICE_URL}/fee`, fetchOptions);
            }
            throw new Error('Could not retrieve service token');
        });
};

const authorise = () => {
    logInfo('authorise');
    const headers = {
        'Content-Type': 'application/json'
    };
    const params = {
        microservice: SERVICE_NAME,
        oneTimePassword: otp({secret: S2S_SECRET}).totp()
    };
    const fetchOptions = utils.fetchOptions(params, 'POST', headers);
    return utils.fetchText(SERVICE_AUTHORISATION_URL, fetchOptions);
};

const getUserDetails = (securityCookie) => {
    logInfo('getUserDetails');
    const url = `${IDAM_SERVICE_URL}/details`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${securityCookie}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchJson(url, fetchOptions);
};

const getOauth2Token = (code, redirectUri) => {
    logInfo('calling oauth2 token');
    const clientName = config.services.idam.oauth2.client;
    const secret = config.services.idam.oauth2.secret;
    const idam_api_url = config.services.idam.apiUrl;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    return utils.fetchJson(`${idam_api_url}/oauth2/token`, {
        method: 'POST',
        timeout: 10000,
        body: params.toString(),
        headers: headers
    });
};

module.exports = {
    loadCaseData,
    getFeeAmount,
    getUserDetails,
    getOauth2Token
};
