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
    title: 'requiredInfoStubName',
    schema: 'requiredInfoStubSchema'
};
const optionalInfoStub = {
    description: 'optionalInfoStubDescription',
    title: 'optionalInfoStubName',
    schema: 'optionalInfoStubSchema',
    version: 'optionalInfoStubVersion',
    contact: 'myContact',
    license: 'myLicense',
    termsOfService: 'myTOS',
    postmanId: 'optionalInfoStubId'
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
    t.comment('Testing info() inputs');
    t.doesNotThrow(() => info(requiredInfoStub), null , 'Accepts valid argument with required properties');
    t.doesNotThrow(() => info(optionalInfoStub), null , 'Accepts valid argument with optional properties');
    t.throws(() => info(), /Missing required config property: title/, 'Throws without config parameter');
    t.throws(() => info(invalidInfoStub), /Missing required config property: title/, 'Throws if missing required config parameter');
    t.throws(() => info('mySwaggerJSON'), /Missing required config property: title/, 'Throws if config parameter is not type `object`');

    // Required Parameter Output Tests
    t.comment('Testing info() output with only required config parameter properties');
    let reqInfo = info(requiredInfoStub);
    t.equal(typeof reqInfo, 'object', 'Returns an object');
    t.ok(reqInfo.hasOwnProperty('_postman_id'), 'Contains `_postman_id` property by default');
    t.ok(reqInfo.hasOwnProperty('name'), 'Contains `name` property as required');
    t.ok(reqInfo.hasOwnProperty('schema'), 'Contains `schema` property as required');

    // Optional Parameter Output Tests
    t.comment('Testing info() output with all supplied config properties');
    let optInfo = info(optionalInfoStub);
    t.equal(typeof optInfo, 'object', 'Returns an object');
    t.ok(optInfo.hasOwnProperty('name'), 'Contains `name` property as required');
    t.ok(optInfo.hasOwnProperty('schema'), 'Contains `schema` property as required');
    t.ok(optInfo.hasOwnProperty('_postman_id'), 'Contains `_postman_id` property when provided');
    t.equal(optInfo.description, optionalInfoStub.description + '\n\n' + optionalInfoStub.license + '\n\n' + optionalInfoStub.contact + '\n\n' + optionalInfoStub.termsOfService, 'Contains `description` property when provided');
    t.ok(optInfo.hasOwnProperty('version'), 'Contains `version` property when provided');
    t.end();
});
