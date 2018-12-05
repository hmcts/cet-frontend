'use strict';

Feature('Single Executor flow');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-undef

Scenario('Single Executor Journey', function * (I) {

    I.startApplication();

}).retry(3);
