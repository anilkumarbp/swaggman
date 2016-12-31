'use strict';

/**
  * Translator.Variables Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const variables = require('../../lib/translator/variables');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');

test('Translator.variables()', (t) => {
    t.equal(typeof variables, 'function', 'Should be a function');
    t.doesNotThrow(() => {variables()}, null, 'Returns an empty array if not passed any variables');
    t.end();
});
