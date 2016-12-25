'use strict';

/**
  * Translator.Items Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const items = require('../../lib/translator/items');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');

test('Translator.items()', (t) => {
    t.fail('TODO: Complete');
    /*
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.ok(Array.isArray(testItems), 'Item must be type array');
    //t.equal(testItems[0].hasOwnProperty('request'), true, 'Items require `request` property');
    //t.equal(typeof testItems[0].'item'], 'object', 'Required `request` property must be an object');
    */
    t.end();
});
