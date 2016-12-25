'use strict';

module.exports = (type, ...options) => {
    const validTypes = ['awsv4', 'basic', 'digest', 'hawk', 'noauth', 'oauth1', 'oauth2'];

    let authStubs = {
        awsv4: {
            accessKey: process.env.AWSV4_ACCESS_KEY,
            secretKey: process.env.AWSV4_SECRET_KEY,
            region: process.env.AWSV4_REGION,
            service: process.env.AWSV4_SERVICE
        },
        basic: {
            username: process.env.BASIC_USERNAME,
            password: process.env.BASIC_PASSWORD
        },
        digest: {
            username: process.env.DIGEST_USERNAME,
            realm: process.env.DIGEST_,
            password: process.env.DIGEST_PASSWORD,
            nonce: process.env.DIGEST_NONCE,
            nonceCount: process.env.DIGEST_NONCE_COUNT,
            algorithm: process.env.DIGEST_ALGORITHM,
            qop: process.env.DIGEST_QOP,
            clientNonce: process.env.DIGEST_CLIENT_NONCE
        },
        hawk: {
            authId: process.env.HAWK_AUTH_ID,
            authKey: process.env.HAWK_AUTH_KEY,
            algorithm: process.env.HAWK_ALGORITHM,
            user: process.env.HAWK_USER,
            nonce: process.env.HAWK_NONCE,
            extraData: process.env.HAWK_EXTRA_DATA,
            appId: process.env.HAWK_APP_ID,
            delegation: process.env.HAWK_DELEGATION
        },
        noauth: null,
        oauth1: {
            consumerKey: process.env.OAUTH1_CONSUMER_KEY,
            consumerSecret: process.env.OAUTH1_CONSUMER_SECRET,
            token: process.env.OAUTH1_TOKEN,
            tokenSecret: process.env.OAUTH1_TOKEN_SECRET,
            signatureMethod: process.env.OAUTH1_SIGNATURE_METHOD,
            timestamp: process.env.OAUTH1_TIMESTAMP,
            nonce: process.env.OAUTH1_NONCE,
            version: process.env.OAUTH1_VERSION,
            realm: process.env.OAUTH1_REALM,
            encodeOAuthSign: process.env.OAUTH1_ENCODE_OAUTH_SIGN
        },
        oauth2: {
            addTokenTo: process.env.OAUTH2_ADD_TOKEN_TO,
            callBackUrl: process.env.OAUTH2_CALLBACK_URL,
            authUrl: process.env.OAUTH2_AUTH_URL,
            accessTokenUrl: process.env.OAUTH2_ACCESS_TOKEN_URL,
            clientId: process.env.OAUTH2_CLIENT_ID,
            clientSecret: process.env.OAUTH2_CLIENT_SECRET,
            scope: process.env.OAUTH2_SCOPE,
            requestAccessTokenLocally: process.env.REQUEST_ACCESS_TOKEN_LOCALLY
        }
    };

    // Error if type is set and invalid
    if(type) {
        if('string' !== typeof type) throw new Error('Invalid type argument provided to translator.auth, must be of type `string`');
        if(-1 === validTypes.indexOf(type)) throw new Error('Unknown `type` argument value provided to translator.auth');
        //const validMethods = ['get', 'post', 'put', 'delete', 'options', 'copy', 'head', 'link', 'unlink', 'purge', 'lock', 'unlock', 'propfind', 'view'];
        return new Promise((resolve, reject) => {
            // Use the Environment Variables as Defaults for ALL routes
            if(!options || 0 === options.length) {
                let authObj = {};
                authObj['type'] = type.toLowerCase();
                authObj[type.toLowerCase()] = authStubs[type];
                resolve(authObj);
            } else {
                // Helpers lookups
                // Did we receive a path argument?
                    // Did we receive a method argument?
            }
        });
    } else {
        // Default to OAuth2 using environment variables when no arguments are supplied
        return new Promise((resolve, reject) => {
            resolve({
                type: 'oauth2',
                oauth2: {
                    addTokenTo: 'Header',
                    callBackUrl: 'https://www.getpostman.com/oauth2/callback',
                    authUrl: process.env.OAUTH2_AUTH_URL,
                    accessTokenUrl: process.env.OAUTH2_ACCESS_TOKEN_URL,
                    clientId: process.env.OAUTH2_CLIENT_ID,
                    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
                    scope: process.env.OAUTH2_SCOPE,
                    requestAccessTokenLocally: process.env.REQUEST_ACCESS_TOKEN_LOCALLY
                }
            });
        });
    }
};
