'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const logger = require('app/components/logger')('Init');
const testConfig = require('test/config');

describe('Address Lookup API Tests', () => {
    describe('Basic ping', () => {
        it('Returns HTTP 403 status', (done) => {
            request(testConfig.postcodeLookup.url)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(403)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.detail).to
                            .equal('You do not have permission to perform this action.');
                    }
                    done();
                });
        });
    });
});
