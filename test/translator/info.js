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
const infoStub = {
    _postman_id: 'string',
    description: 'string',
    name: 'string',
    schema: 'string',
    version: 'string'
};


test('Translator.info', (t) => {
    // Throws errors on invalid or unknown type argument
    t.throws(() => info('mySwaggerJSON'), /Invalid argument, requires swaggerJSON object/, 'Throws if `type` argument is not a known Postman Auth type');

    // Should be a function
    t.equal(typeof info, 'function', 'Should be a function');
    t.end();
});

test('Translator.info(swaggerJSON) operates as expected', (t) => {
    t.doesNotThrow(() => info(swaggerStub), null , 'Accepts valid argument');
    let infoSchemaTest = info(swaggerStub);
    t.ok(infoSchemaTest.hasOwnProperty('_postman_id'), 'Contains `_postman_id` property');
    t.ok(infoSchemaTest.hasOwnProperty('name'), 'Contains `name` property');
    t.ok(infoSchemaTest.hasOwnProperty('description'), 'Contains `description` property');
    t.ok(infoSchemaTest.hasOwnProperty('schema'), 'Contains `schema` property');
    t.ok(infoSchemaTest.hasOwnProperty('version'), 'Contains `version` property');
    t.end();
});
