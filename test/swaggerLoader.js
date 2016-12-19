'use strict';

const tape = require('tape');
const _test = require('tape-promise').default;
const test = _test(tape); //decorate tape
const loader = require('../lib/swaggerLoader');

test('SwaggerLoader', (t) => {
    //t.plan(2);
    t.comment('load()');
    t.equal(typeof loader.load, 'function', 'Exposes load() method');
    t.throws(() => loader.load(), /Swagger specification file or URI is required/, 'load() throws when argument is undefined');
    t.throws(() => loader.load(123), /Swagger specification file or URI is required/, 'load() throws when argument is non-string type');
    t.throws(() => loader.load(true), /Swagger specification file or URI is required/, 'load() throws when argument is non-string type');
    t.throws(() => loader.load(''), /Swagger specification file or URI is required/, 'load() throws when argument is empty string');
    t.doesNotThrow(() => loader.load('./ref/RingCentral_Swagger_Basic_20161116.json'), null, 'load() accepts non-empty string as an argument');
    t.end();
});

/*
test('Loading via Promise of async URI', (t) => {
    return loader.load('https://developers.ringcentral.com/api-explorer/latest/swagger-ring_basic.json').then((uriData) => {
        t.equal(uriData, 'object', 'Returns parsed object from URI');
    });
});
*/
