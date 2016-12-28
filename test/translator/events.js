'use strict';

/**
  * Translator.Events Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const fs = require('fs');
const myHelpers = require('../../helpers');
const test = require('tape');
const events = require('../../lib/translator/events');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
const myDefaultGlobals = [
    {
        listen: 'test',
        script: 'some test javascript'
    },
    {
        listen: 'prerequest',
        script: 'some prerequest javascript',
        disabled: true
    }
];

test('Translator.events()', (t) => {
    t.equal(typeof events, 'function', 'Should be a function');

    t.throws(() => { events() }, /Requires at least one argument, either `globals` or path/, 'Requires at least one parameter of type string');
    t.throws(() => { events(123) }, /Invalid argument type supplied for `path` to translator.events()/, 'Throws error if `path` argument is not a string');
    t.throws(() => { events('/some/failing/path') }, /Unknown path supplied to translator.events()/, 'Throws error if `path` argument is not represented in Helpers');
    t.deepEqual(events('globals'), myDefaultGlobals, 'If only parameter supplied is string `globals`, returns expected default events');
    t.end();
});
