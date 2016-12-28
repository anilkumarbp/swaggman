'use strict';

/**
  * Translator.Info Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const info = require('../../lib/translator/info');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
const requiredInfoStub = {
    name: 'requiredInfoStubName',
    schema: 'requiredInfoStubSchema'
};
const optionalInfoStub = {
    _postman_id: 'optionalInfoStubId',
    description: 'optionalInfoStubDescription',
    name: 'optionalInfoStubName',
    schema: 'optionalInfoStubSchema',
    version: 'optionalInfoStubVersion'
};
const invalidInfoStub = {
    description: 'invalidInfoStubDescription',
    schema: 'invalidInfoStubSchema',
    version: 'invalidInfoStubVersion'
};


test('Translator.info', (t) => {
    // Must be a function
    t.equal(typeof info, 'function', 'Should be a function');

    // Input Tests
    t.comment('Input tests');
    t.doesNotThrow(() => info({info: requiredInfoStub}), null , 'Accepts valid argument with required properties');
    t.doesNotThrow(() => info({info: optionalInfoStub}), null , 'Accepts valid argument with optional properties');
    t.throws(() => info(invalidInfoStub), /Missing property `info` on object supplied as argument to translator.info()/, 'Cannot operate without the `info` property set on the object supplied as argument');
    t.throws(() => info({info: invalidInfoStub}), /Missing property `name` on info object supplied as argument to translator.info()/, 'Requires argument object.info to have property `name` at a minimum to operate');
    t.throws(() => info('mySwaggerJSON'), /Invalid argument type, requires object/, 'Requires the `swaggerJSON` parameter to be of type `object` to operate');

    // Required Parameter Output Tests
    t.comment('Required Parameter Output Tests');
    let reqInfo = info({info: requiredInfoStub});
    t.equal(typeof reqInfo, 'object', 'Returns an object');
    t.ok(reqInfo.hasOwnProperty('_postman_id'), 'Contains `_postman_id` property by default');
    t.ok(reqInfo.hasOwnProperty('name'), 'Contains `name` property as required');
    t.ok(reqInfo.hasOwnProperty('schema'), 'Contains `schema` property as required');

    // Optional Parameter Output Tests
    t.comment('Optional Parameter Output Tests');
    let optInfo = info({info: optionalInfoStub});
    t.equal(typeof optInfo, 'object', 'Returns an object');
    t.ok(optInfo.hasOwnProperty('name'), 'Contains `name` property as required');
    t.ok(optInfo.hasOwnProperty('schema'), 'Contains `schema` property as required');
    t.ok(optInfo.hasOwnProperty('_postman_id'), 'Contains `_postman_id` property when provided');
    t.equal(optInfo.description, optionalInfoStub.description, 'Contains `description` property when provided');
    t.ok(optInfo.hasOwnProperty('version'), 'Contains `version` property when provided');
    t.end();
});
