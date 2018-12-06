'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class Judgement extends ValidationStep {

    static getUrl () {
        return '/judgement';
    }
}

module.exports = Judgement;
