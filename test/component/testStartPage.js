'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('start', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Start');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });
    });
});
