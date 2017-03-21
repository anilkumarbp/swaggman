'use strict';

/**
  * Translator.Urls Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const urls = require('../../lib/translator/urls');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
const stringUrlStub = '/v1.0/some/path/to/{templateId}/resource';
const briefUrlStub = {
    protocol: 'myProtocol',
    domain: 'my.domain.com',
    path: 'myPath',
    port: 'myPort',
    query: [{key: 'myKey', value: 'myValue', description: 'myDescription'}],
    hash: '#myHash',
    variable: [{id: 'myId', value: 'myValue', type: 'myType', name: 'myName'}]
};
const expandedUrlStub = {
    protocol: 'yourProtocol',
    domain: ['your', 'domain', 'com'],
    path: ['your', 'url', 'path'],
    port: 'yourPort',
    query: [{key: 'yourKey', value: 'yourValue', description: 'yourDescription'}],
    hash: '#myHash',
    variable: [{id: 'yourId', value: 'yourValue', type: 'yourType', name: 'yourName'}]
};

test('Translator.urls()', (t) => {
    t.equal(typeof urls, 'function', 'Should be a function');
    t.equal(typeof urls('/v1.0.0/some/route'), 'string', 'Can be a string');
    t.equal(typeof urls(expandedUrlStub), 'object', 'Can be an object');
    t.looseEqual(urls(expandedUrlStub), expandedUrlStub, 'Returns valid Postman URL object from expanded argument properties');
    t.deepEqual(urls(briefUrlStub), briefUrlStub, 'Returns valid Postman URL object from brief argument properties');
    //t.throws(() => {urls(123)}, /Invalid parameter type, requires `string` or `object`/, 'Requires string or object as argument');
    t.end();
});
