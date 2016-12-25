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
    t.fail('TODO: Complete');
    /*
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.comment('TODO: Need to improve this quite a bit');
    */
    t.end();
});
