'use strict';

const test = require('tape');
let SwaggMan = require('../swaggman');

test('Swaggman Class', (t) => {
    let swaggman = new SwaggMan();
    t.plan(2);
    t.ok(swaggman);
    t.equal(swaggman instanceof SwaggMan, true, 'Instances have the proper prototype');
    t.end();
});
