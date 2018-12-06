'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class Claimant extends ValidationStep {

    static getUrl () {
        return '/claimant';
    }
}

module.exports = Claimant;
