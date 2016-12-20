'use strict';

const test = require('tape');
const translate = require('../lib/translator');

test('Builder', (t) => {
    t.comment('info()');
    t.equal(typeof translate.info, 'function', 'Exposes info() method');
    t.doesNotThrow(() => translate.info('swagger'), null , 'info() method accepts valid argument');
    t.throws(() => translate.info(123), /Invalid input type/, 'translate.info() throws when argument is invalid');
    t.equal(typeof translate.info('swagger'), 'object', 'translate.info() returns valid postman info object');
    t.end();
});

