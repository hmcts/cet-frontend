module.exports = {

    TestIdamBaseUrl: process.env.IDAM_API_URL || 'http://localhost:8484',
    TestFrontendUrl: process.env.TEST_URL || 'http://localhost:3000',
    TestE2EFrontendUrl: process.env.TEST_E2E_URL || 'http://localhost:3000',
    TestUseIdam: process.env.USE_IDAM || 'false',
    TestUseSidam: process.env.USE_SIDAM || 'true',
    TestIdamLoginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',
    TestUseGovPay: process.env.USE_GOV_PAY || 'false',
    TestIdamUserGroup: process.env.IDAM_USER_GROUP,
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE,
    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN || '@test.com',
    TestRetryScenarios: process.env.RETRY_SCENARIOS || 3,

    postcodeLookup: {
        token: process.env.ADDRESS_TOKEN,
        url: process.env.POSTCODE_SERVICE_URL,
        endpoint: process.env.POSTCODE_SERVICE_ENDPOINT || '/addresses',
        contentType: 'application/json',
        singleAddressPostcode: 'SW1A 1AA',
        singleOrganisationName: 'BUCKINGHAM PALACE',
        singleFormattedAddress: 'Buckingham Palace\nLondon\nSW1A 1AA',
        multipleAddressPostcode: 'N145JY',
        partialAddressPostcode: 'N14',
        invalidAddressPostcode: 'Z99 9ZZ',
        emptyAddressPostcode: ''
    },

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: process.env.TEST_EMAIL_ADDRESS,
    TestEnvMobileNumber: process.env.TEST_MOBILE_NUMBER,
    links: {
        cookies: '/cookies',
        terms: process.env.TERMS_AND_CONDITIONS,
        privacy: '/privacy-policy',
        contact: '/contact-us',
        howToManageCookies: 'https://www.aboutcookies.org',
        googlePrivacyPolicy: 'https://www.google.com/policies/privacy/partners/',
        googleAnalyticsOptOut: 'https://tools.google.com/dlpage/gaoptout/',
        mojPersonalInformationCharter: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter',
        goodThingsFoundation: 'https://www.goodthingsfoundation.org',
        subjectAccessRequest: 'https://www.gov.uk/government/publications/request-your-personal-data-from-moj',
        complaintsProcedure: 'https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure',
        informationCommissionersOffice: 'https://ico.org.uk/global/contact-us',
    },
    helpline: {
        number: '0300 303 0648',
        hours: 'Monday to Friday, 9:30am to 5pm'
    }
};
