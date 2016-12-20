'use strict';

// Dependencies
const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const translate = require('../lib/translator');
const Validator = require('jsonschema').Validator;
const v = new Validator();

// TODO: !!!! ---> Add references in Validator to Postman Schema
/*
v.addSchema(infoSchema, postmanSchema.definitions.info);
v.addSchema(itemSchema, postmanSchema.definitions.item);
v.addSchema(folderSchema, postmanSchema.definitions.item-group);
v.addSchema(requestSchema, postmanSchema.definitions.request);
v.addSchema(responseSchema, postmanSchema.definitions.response);
v.addSchema(scriptSchema, postmanSchema.definitions.script);
v.addSchema(uriSchema, postmanSchema.definitions.uri);
v.addSchema(variableSchema, postmanSchema.definitions.variable);
v.addSchema(headerSchema, postmanSchema.definitions.header);
v.addSchema(eventSchema, postmanSchema.definitions.event);
v.addSchema(descriptionSchema, postmanSchema.definitions.description);
v.addSchema(cookieSchema, postmanSchema.definitions.cookie);
v.addSchema(authSchema, postmanSchema.definitions.auth);
*/

// Stubs
const swaggerStub = require('./RCSwagger_20161116.json');

test('Translator', (t) => {
    t.equal(typeof translate.info, 'function', 'Exposes info() method');
    t.equal(typeof translate.items, 'function', 'Exposes items() method');
    t.equal(typeof translate.events, 'function', 'Exposes events() method');
    t.equal(typeof translate.params, 'function', 'Exposes params() method');
    t.equal(typeof translate.variables, 'function', 'Exposes variables() method');
    t.equal(typeof translate.auth, 'function', 'Exposes auth() method');
    t.equal(typeof translate.isValid, 'function', 'Exposes isValid() method');
    t.end();
});

test('Translator.info()', (t) => {
    t.doesNotThrow(() => translate.info(swaggerStub), null , 'Accepts valid argument');
    t.throws(() => translate.info(123), /Invalid argument, requires swaggerJSON/, 'Throws when argument is invalid');
    //t.equal(typeof translate.info('swagger'), 'object', 'Returns valid postman info object');
    t.end();
});

test('Translator.items()', (t) => {
    t.fail('TODO!!! ETL Postman Folders and Items from Swagger');
    t.end();
});

test('Translator.events()', (t) => {
    t.fail('TODO!!! Must build `test` and `prerequest` events where appropriate from helpers');
    t.end();
});

test('Translator.params()', (t) => {
    t.fail('TODO!!! Must be able to properly translate query, header, and body parameters');
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

test('Translator.isValid(definitionId, testData)', (t) => {
    t.fail('TODO!!! Make sure testData satisfies definition requirements');
    t.end();
});
