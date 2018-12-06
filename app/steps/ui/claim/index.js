'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class Claim extends ValidationStep {

    static getUrl () {
        return '/claim';
    }
}

module.exports = Claim;
