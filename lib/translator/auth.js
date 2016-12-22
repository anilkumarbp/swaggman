'use strict';

module.exports = (swaggerJSON, path, verb) => {
    let authObj = {
        type: 'oauth2',
        oauth2: {
            addTokenTo: 'Header',
            callBackUrl: 'https://www.getpostman.com/oauth2/callback',
            authUrl: 'https://platform.devtest.ringcentral.com/restapi/oauth/authorize',
            accessTokenUrl: 'https://platform.devtest.ringcentral.com/restapi/oauth/token',
            clientId: process.env.rcAppKey,
            clientSecret: process.env.rcAppSecret,
            scope: ''
        }
    };

    return authObj;
};
