const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('Start', () => {

    const steps = initSteps(
        [`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const start = steps.Start;

    it('test correct url is returned from getUrl function', () => {
        assert.equal(start.constructor.getUrl(), '/start');
    });
});
