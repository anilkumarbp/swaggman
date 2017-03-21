'use strict';

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const translate = require('../../lib/translator');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');

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
