'use strict';

const Step = require('app/core/steps/Step');

class Start extends Step {

    static getUrl () {
        return '/start';
    }
}

module.exports = Start;
