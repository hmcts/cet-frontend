'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');

class Judgement extends ValidationStep {

    static getUrl () {
        return '/judgement';
    }

    * getContextData (req) {
        const ctx = super.getContextData(req);
        Object.assign(ctx, req.session.form || {});
        ctx.courtFees = yield services.getFeeAmount(req.authToken);
        return ctx;
    }
}

module.exports = Judgement;
