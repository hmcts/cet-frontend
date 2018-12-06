'use strict';
const i18next = require('i18next'),
    mapValues = require('lodash').mapValues,
    journeyMap = require('app/core/journeyMap');

const commonContent = function (lang = 'en') {
    i18next.changeLanguage(lang);
    const common = require('app/resources/en/translation/common');
    return mapValues(common, (value, key) => i18next.t(`common.${key}`));
};

const updateTaskStatus = function (ctx, req, steps) {
    const formdata = req.session.form;
    const stepList = journeyMap.stepList;
    Object.keys(stepList).forEach(stepName => {
        let step = journeyMap(stepName)

            const localctx = step.getContextData(req);
            const featureToggles = req.session.featureToggles;
            const [stepCompleted, progressFlag] = step.isComplete(localctx, formdata,
                featureToggles);
            const nextStep = step.next(localctx);
            if (stepCompleted && nextStep !== steps.StopPage) {
                status = progressFlag !== 'noProgress' ? 'started' : status;
                step = nextStep;
            } else {
                break;
            }
        status = step.name === task.lastStep ? 'complete' : status;
        const nextURL = step.constructor.getUrl();
        const checkYourAnswersLink = steps[task.summary].constructor.getUrl();

        ctx[taskName] = {status, nextURL, checkYourAnswersLink};
    });
};

module.exports = {
    commonContent,
    updateTaskStatus
};
