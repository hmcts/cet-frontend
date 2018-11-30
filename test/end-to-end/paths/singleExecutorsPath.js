'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Single Executor flow');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(() => {
    TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Single Executor Journey'), function * (I) {

    //Pre-IDAM
    I.startApplication();

    // if (TestConfigurator.getUseGovPay() === 'true') {
    //     I.enterGrossAndNet('205', '600000', '300000');
    // } else {
    //     I.enterGrossAndNet('205', '500', '400');
    // }

}).retry(TestConfigurator.getRetryScenarios());
