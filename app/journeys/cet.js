'use strict';

const stepList = {
    Start: 'ApplicantName',
    ApplicantName: 'ApplicantAddress',
    ApplicantAddress: 'ExecutorsNumber',
    PaymentBreakdown: 'PaymentStatus',
    PaymentStatus: 'ThankYou',
    ThankYou: 'ThankYou',
    AddressLookup: 'AddressLookup',
    TermsConditions: 'TermsConditions',
};

module.exports.stepList = stepList;
