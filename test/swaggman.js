'use strict';

const test = require('tape');
let SwaggMan = require('../swaggman');

test('Swaggman Class', (t) => {
    let swaggman = new SwaggMan();
    //t.plan(2);
    t.equal(typeof SwaggMan, 'function', 'Can be instantiated');
    t.ok(swaggman, 'Exists after instantiation');
    t.equal(swaggman instanceof SwaggMan, true, 'Instances have the proper prototype');
    t.equal(typeof swaggman.convert, 'function', 'Exposes a convert method');
    t.throws(swaggman.convert(), Error('convert method requires a string parameter which is the path or URI to your Swagger specification'), 'convert() requires a string parameter to Swagger specification file or URI');
    t.end();
});
