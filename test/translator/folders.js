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
const foldersBase = [];
const folderStub = {
    name: 'folderName',
    description: 'folderDescription',
    item: [],
    auth: {}
};

test('Translator.folders()', (t) => {
    /*
    t.equal(typeof folders, 'function', 'translator.folders is a function');
    t.throws(() => { folders() }, /Missing argument, requires two parameters/, 'translator.folders() requires `folderName` and `items` parameters');
    t.throws(() => { folders(123, [{}]) }, /Invalid argument type, `folderName` argument must be of type `string`/, 'translator.folders() requires `folderName` parameter to be a `string`');
    t.throws(() => { folders('testFolderName') }, /Missing argument, requires `items` parameter/, 'translator.folders() requires `items` parameter');
    t.throws(() => { folders('testFolderName', {}) }, /Invalid argument type, `items` argument must be of type `array`/, 'translator.folders() requires `items` parameter to be an `array`');
    t.doesNotThrow(() => { folders('testFolderName', [{}]) }, null, 'When supplied valid parameters, does not throw an error');
    if(process.env.TAGS_ARE_FOLDERS) {
        let dummyFolders = [];
        swaggerStub.tags.forEach((tag) => {
            let fStub = {};
            if(tag['name'])         fStub['name'] = tag['name'];
            if(tag['item'])         fStub['item'] = [];
            if(tag['auth'])         fStub['auth'] = {};
            if(tag['description'])  fStub['description'] = tag['description'];
            dummyFolders.push(fStub);
        });
    }
    let testFolders = folders(swaggerStub);
    t.ok(Array.isArray(testFolders), 'Folders must be type array');
    t.ok( 'object' === typeof testFolders[0], 'Folder elements should be objects');
    t.equal(testFolders[0].hasOwnProperty('items'), true, 'Each folder requires `items` property');
    */

    /*
    t.comment('Returns valid Postman folders schema');
    let stubFolders = swaggerStub.tags; // SwaggerSpec.tags are Postman.items (duck-typed as folders)
    // Swagger.tag object has: name, description, externalDocs properties
    stubFolders.forEach((tagObj) => {
        let testFolder = folders(tagObj.name, [{dummyItem: {}}]); // Provide a valid set or parameters
        t.ok(testFolder['item'], 'Items as folders require the `item` property be set on each folder');
        t.ok(Array.isArray(testFolder['item']), 'The `item` property on a folder, must be of type `array`');
        if(testFolder.hasOwnProperty('name')) t.ok(testFolder['name'], 'If Swagger.tag.name, translate to the Postman.folder.name');
        if(testFolder.hasOwnProperty('description')) t.ok(testFolder['description'], 'If Swagger.tag.description, translate to the Postman.folder.description');
    });
    */
    t.end();
});
