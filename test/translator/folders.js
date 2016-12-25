'use strict';

/**
  * Translator.Folders Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const folders = require('../../lib/translator/folders');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');

test('Translator.folders()', (t) => {
    t.fail('TODO: Complete');
    /*
    let testFolders = translate.folders(swaggerStub);
    t.ok(Array.isArray(testFolders), 'Folders must be type array');
    t.ok( 'object' === typeof testFolders[0], 'Folder elements should be objects');
    t.equal(testFolders[0].hasOwnProperty('items'), true, 'Each folder requires `items` property');
    */
    t.end();
});
