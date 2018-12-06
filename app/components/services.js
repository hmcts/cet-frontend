'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const BACKEND_SERVICE_URL = "http://localhost:3000/data";
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const loadCaseData = (id, sessionID) => {
    logInfo('loadCaseData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    logInfo(`loadFormData url: ${BACKEND_SERVICE_URL}/${id}`);
    return utils.fetchJson(`${BACKEND_SERVICE_URL}/${id}`, fetchOptions);
};

const saveFormData = (id, data, sessionID) => {
    logInfo('saveFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const body = {
        id: id,
        formdata: data,
        submissionReference: data.submissionReference
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}`, fetchOptions);
};


module.exports = {
    loadCaseData: loadCaseData,
    saveFormData
};
