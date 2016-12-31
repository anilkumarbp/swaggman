'use strict';

/**
  * Translator.Requests Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const auth = require('../../lib/translator/auth');
const requests = require('../../lib/translator/requests');
const urls = require('../../lib/translator/urls');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
const authStub = {
    type: 'basic',
    basic: { username: 'myUsername', password: 'myPassword' }
};
const bodyStub = {
    mode: 'raw',
    raw: 'myRawBodyString'
};
const headerStub = {
    key: 'Content-Type',
    value: 'application/json'
};
const urlStub = {
    protocol: 'myProtocol',
    domain: 'my.domain.com',
    path: 'myPath',
    port: 'myPort',
    query: [{key: 'myKey', value: 'myValue', description: 'myDescription'}],
    hash: '#myHash',
    variable: [{id: 'myId', value: 'myValue', type: 'myType', name: 'myName'}]
};
const validSwaggerInValues = ['query', 'header', 'path', 'formData', 'body'];
const validMethods = ['get', 'put', 'post', 'patch', 'delete', 'options', 'head'];
const validPostmanBodyModes = ['raw', 'urlencoded', 'formdata', 'file'];
const briefRequestStub = {
    url: '/v1.0/account/{{accountId}}/extension/{{extensionId}}',
    auth: authStub,
    method: validMethods[0],
    header: 'myHeaderString',
    body: bodyStub
};
const expandedRequestStub = {
    url: urlStub,
    auth: authStub,
    method: validMethods[1],
    header: headerStub,
    body: bodyStub
};

test('Translator.requests()', (t) => {
    t.equal(typeof requests, 'function', 'Should be a function');
    let stringIn = requests('/v1.0.0/some/route');
    t.equal(typeof stringIn, 'string', 'Accepts string as input');
    t.equal(stringIn, '/v1.0.0/some/route', 'If request is provided as a string, should just return the string');
    t.equal(typeof requests(expandedRequestStub), 'object', 'Accepts object as input');
    t.looseEqual(requests(expandedRequestStub), expandedRequestStub, 'Returns valid Postman Request object from expanded argument properties');
    t.deepEqual(requests(briefRequestStub), briefRequestStub, 'Returns valid Postman Request object from brief argument properties');
    t.end();
});
