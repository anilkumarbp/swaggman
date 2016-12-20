'use strict';

const test = require('tape');
const translate = require('../lib/translator');

// Stubs
const swaggerSpec = require('../ref/RingCentral_Swagger_Basic_20161116.json');

test('Translator', (t) => {
    t.equal(typeof translate.info, 'function', 'Exposes info() method');
    t.equal(typeof translate.items, 'function', 'Exposes items() method');
    t.equal(typeof translate.events, 'function', 'Exposes events() method');
    t.equal(typeof translate.params, 'function', 'Exposes params() method');
    t.equal(typeof translate.variables, 'function', 'Exposes variables() method');
    t.equal(typeof translate.auth, 'function', 'Exposes auth() method');
    t.end();
});

test('Translator.info()', (t) => {
    t.doesNotThrow(() => translate.info(swaggerSpec), null , 'Accepts valid argument');
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
