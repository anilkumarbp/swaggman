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

test('Translator.info(swaggerJSON)', (t) => {
    t.fail('TODO: Complete');
    /*
    let testInfo = translate.info(swaggerStub);
    t.doesNotThrow(() => translate.info(swaggerStub), null , 'Accepts valid argument');
    t.throws(() => translate.info(123), /Invalid argument, requires swaggerJSON/, 'Throws when argument is invalid');
    t.equal(testInfo.hasOwnProperty('_postman_id'), true, 'Output contains `_postman_id` property');
    t.equal(testInfo.hasOwnProperty('schema'), true, 'Output contains `schema` property');
    t.equal(testInfo.hasOwnProperty('name'), true, 'Output contains `name` property');
    t.equal(testInfo.hasOwnProperty('description'), true, 'Output contains `description` property');
    //t.equal(typeof translate.info('swagger'), 'object', 'Returns valid postman info object');
    */
    t.end();
});
