'use strict';

const stepList = {
    Start: 'Summary',
    Summary: 'Claimant',
    Claimant: 'Defendant',
    Defendant: 'Judgement',
    Judgement: 'Claim',
    Claim: 'Summary',
};

module.exports.stepList = stepList;
