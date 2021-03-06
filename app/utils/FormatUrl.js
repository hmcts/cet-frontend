'use strict';

const url = require('url');
const config = require('app/config');

class FormatUrl {
    static format (serviceUrl, servicePath = '') {
        const urlParts = url.parse(serviceUrl);
        const port = urlParts.port ? `:${urlParts.port}` : '';
        let path = servicePath || urlParts.path;
        path = path !== '/' ? path : '';
        return `${urlParts.protocol}//${urlParts.hostname}${port}${path}`;
    }

    static createHostname (req) {
        return `${config.frontendPublicHttpProtocol.toLowerCase()}://${req.get('host')}`;
    }
}

module.exports = FormatUrl;
