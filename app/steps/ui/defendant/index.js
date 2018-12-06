'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class Defendant extends ValidationStep {

    static getUrl () {
        return '/defendant';
    }
}

module.exports = Defendant;
