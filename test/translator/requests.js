'use strict';

/**
  * Translator.Requests Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const requests = require('../../lib/translator/requests');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');

test('Translator.requests()', (t) => {
    t.fail('Complete');
    /*
    // TODO: Need to drastically improve this, needs to be tested in isolation
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.comment('TODO: Need to improve this quite a bit');
    */
    t.end();
});
