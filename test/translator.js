'use strict';

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const translate = require('../lib/translator');

// Stubs
const swaggerStub = require('./RCSwagger_20161116.json');

test('Translator', (t) => {
    t.equal(typeof translate.info, 'function', 'Exposes info() method');
    t.equal(typeof translate.items, 'function', 'Exposes items() method');
    t.equal(typeof translate.folders, 'function', 'Exposes folders() method');
    t.equal(typeof translate.events, 'function', 'Exposes events() method');
    t.equal(typeof translate.params, 'function', 'Exposes params() method');
    t.equal(typeof translate.urls, 'function', 'Exposes urls() method');
    t.equal(typeof translate.requests, 'function', 'Exposes requests() method');
    t.equal(typeof translate.variables, 'function', 'Exposes variables() method');
    t.equal(typeof translate.auth, 'function', 'Exposes auth() method');
    t.end();
});

test('Translator.info(swaggerJSON)', (t) => {
    let testInfo = translate.info(swaggerStub);
    t.doesNotThrow(() => translate.info(swaggerStub), null , 'Accepts valid argument');
    t.throws(() => translate.info(123), /Invalid argument, requires swaggerJSON/, 'Throws when argument is invalid');
    t.equal(testInfo.hasOwnProperty('_postman_id'), true, 'Output contains `_postman_id` property');
    t.equal(testInfo.hasOwnProperty('schema'), true, 'Output contains `schema` property');
    t.equal(testInfo.hasOwnProperty('name'), true, 'Output contains `name` property');
    t.equal(testInfo.hasOwnProperty('description'), true, 'Output contains `description` property');
    //t.equal(typeof translate.info('swagger'), 'object', 'Returns valid postman info object');
    t.end();
});

test('Translator.folders()', (t) => {
    let testFolders = translate.folders(swaggerStub);
    t.ok(Array.isArray(testFolders), 'Folders must be type array');
    t.ok( 'object' === typeof testFolders[0], 'Folder elements should be objects');
    t.equal(testFolders[0].hasOwnProperty('items'), true, 'Each folder requires `items` property');
    t.end();
});

test('Translator.items()', (t) => {
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.ok(Array.isArray(testItems), 'Item must be type array');
    //t.equal(testItems[0].hasOwnProperty('request'), true, 'Items require `request` property');
    //t.equal(typeof testItems[0].'item'], 'object', 'Required `request` property must be an object');
    t.end();
});

test('Translator.events()', (t) => {
    // TODO: Need to drastically improve this, needs to be tested in isolation
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.comment('TODO: Need to improve this quite a bit');
    t.end();
});

test('Translator.requests()', (t) => {
    // TODO: Need to drastically improve this, needs to be tested in isolation
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.comment('TODO: Need to improve this quite a bit');
    t.end();
});

test('Translator.params()', (t) => {
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.comment('TODO: Need to improve this quite a bit');
    t.end();
});

test('Translator.variables()', (t) => {
    t.fail('TODO??? Set some rational default variables which can be used across multiple environments???');
    t.end();
});

test('Translator.auth()', (t) => {
    t.fail('TODO??? Handle auth properly...Authorization Flow, Implicit Flow, Refresh Flow, etc...???');
    t.end();
});

/*
test('Translator.isValid(definitionId, testData)', (t) => {
    t.fail('TODO!!! Make sure testData satisfies definition requirements');
    t.end();
});
*/
