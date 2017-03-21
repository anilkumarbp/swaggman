'use strict';

/**
  * Translator.Items Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const items = require('../../lib/translator/items');
function* entries(obj) {
    for( let key in obj) 
        yield [key, obj[key]];
};

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');

const postmanItemSchema = {
    id: 'itemId',
    name: 'itemName', // Maps to Swagger.TagSchema.name
    event: [{}],
    request: {},
    response: [{}]
};
const postmanFolderSchema = {
    name: 'folderName', // Maps to Swagger.TagSchema.tag[ITEM.name]
    description: 'folderDescription', // Maps to Swagger.TagSchema.tag[ITEM.description]
    item: [{}], // Duck-type to postmanItemSchema
    auth: {} // If not provided, should use global auth
};

test('Translator.items()', (t) => {
    t.equal(typeof items, 'function', 'translator.items is a function');
    t.throws(() => { items('shouldFail') }, /Cannot create proxy with a non-object as target or handler/, 'Invalid argument type `spec`');
    t.throws(() => { items({swagger: '', info: '', paths: ''}, true) }, /SwaggerSpec.tags property is required if tagsAsFolders is true/, '`TAGS_AS_FOLDERS` requires SwaggerSpec.tags property');
    t.doesNotThrow(() => { items(swaggerStub) }, null, 'With valid args, does not throw an error');
    t.end();
});
