'use strict';

const Step = require('app/core/steps/Step');

class Summary extends Step {

    static getUrl () {
        return '/summary';
    }

    getContextData (req) {
        let ctx = super.getContextData(req);
        Object.assign(ctx, req.session.form || {});
        return ctx;
    }
}

module.exports = Summary;
