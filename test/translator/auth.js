'use strict';

/**
  * Translator.Auth Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
require('dotenv').config();
const tape = require('tape');
const _test = require('tape-promise').default;
const test = _test(tape);
const auth = require('../../lib/translator/auth');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
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

test('Translator.auth', (t) => {
    // Throws errors on invalid or unknown type argument
    t.throws(() => auth('myAuth'), /Unknown `type` argument value provided to translator.auth/, 'Throws if `type` argument is not a known Postman Auth type');
    t.throws(() => auth(123), /Invalid type argument provided to translator.auth, must be of type `string`/, 'Throws if `type` argument is not of type `string`');

    // Should be a function
    t.equal(typeof auth, 'function', 'Should be a function');

    // Should return promise
    t.ok(auth() instanceof Promise, 'Should return a promise');

    t.end();
});

test('Translator.auth accepts valid types and expects `type` to be of type `string`', (t) => {
    t.doesNotThrow(() => auth('awsv4'), 'Accepts `awsv4` type parameter');
    t.doesNotThrow(() => auth('basic'), 'Accepts `basic` type parameter');
    t.doesNotThrow(() => auth('digest'), 'Accepts `digest` type parameter');
    t.doesNotThrow(() => auth('hawk'), 'Accepts `hawk` type parameter');
    t.doesNotThrow(() => auth('noauth'), 'Accepts `noauth` type parameter');
    t.doesNotThrow(() => auth('oauth1'), 'Accepts `oauth1` type parameter');
    t.doesNotThrow(() => auth('oauth2'), 'Accepts `oauth2` type parameter');
    t.end();
});

test('Translator.auth returns defaults when called with no arguments', (t) => {
    return auth().then((result) => {
        t.ok(result.type, 'Contains required `type` property');
        t.equal(result.type, 'oauth2', 'The `type` property defaults to `oauth2`');
        t.ok(result['oauth2'], 'Contains required `oauth2` property');
        t.deepEqual(result['oauth2'], authStubs.oauth2, 'Return object.oauth2 property has necessary schema');
        t.end();
    });
});

test('Translator.auth(`type`) returns valid Postman Auth schema for each valid parameter', (t) => {
    const validTypes = ['awsv4', 'basic', 'digest', 'hawk', 'noauth', 'oauth1', 'oauth2'];
    validTypes.forEach((validType) => {
        return auth(validType).then((result) => {
            t.equal(result.type, validType, 'Auth.type is ' + validType);
            t.ok(result.hasOwnProperty(validType), 'Contains a key titled ' + validType);
            t.deepEqual(result[validType], authStubs[validType], 'Auth.' + validType + ' property has required schema');
            t.end();
        });
    });
});

/* WIP, try not to get hung up on this just yet...
test('Translator.auth(`type`, `path`, `method`) has the required helpers directory available', (t) => {
    let helpers = require('../../helpers');
    return auth('oauth2', '/oauth/token', 'post').then((result) => {
        const authHelper = require('../../' + process.env.HELPERS_DIR + '/auth/' + helpers.prerequest[path])
    });
});

test('Translator.auth(`type`, `path`, `method`) uses helpers to construct Postman Auth schema respectively', (t) => {
    const validTypes = ['awsv4', 'basic', 'digest', 'hawk', 'noauth', 'oauth1', 'oauth2'];
    const sampleAuthPath = '/oauth/token';
    const sampleNonAuthPath = '/v1.0/account/{accountId}/extension/{extensionId}';
    const validMethods = ['get', 'post', 'put', 'delete', 'options', 'copy', 'head', 'link', 'unlink', 'purge', 'lock', 'unlock', 'propfind', 'view'];
});
*/
