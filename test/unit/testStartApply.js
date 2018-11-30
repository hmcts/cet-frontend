const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('StartApply', () => {

    const steps = initSteps(
        [`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const startApply = steps.StartApply;

    it('test correct url is returned from getUrl function', () => {
        assert.equal(startApply.constructor.getUrl(), '/start-apply');
    });
});
