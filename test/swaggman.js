const test = require('tape');
let SwaggMan = require('../swaggman');

test('Swaggman Class', (t) => {
    let swaggman = new SwaggMan();
    t.plan(2);
    t.equal(err, null);
    t.equal(swaggman instanceof SwaggMan);
    t.end();
});
