'use strict';

const test = require('tape');
let SwaggMan = require('../swaggman');

test('Swaggman Class', (t) => {
    let swaggman = new SwaggMan();
    //t.plan(2);
    t.comment('Constructor');
    t.equal(typeof SwaggMan, 'function', 'Can be instantiated');
    t.ok(swaggman, 'Exists after instantiation, and can be instantiated with no arguments');
    t.equal(swaggman instanceof SwaggMan, true, 'Instances have the proper prototype');
    t.comment('convert()');
    t.equal(typeof swaggman.convert, 'function', 'Exposes convert() method');
    t.doesNotThrow(() => swaggman.convert('swagger'), null , 'convert() method accepts string as an argument');
    t.throws(() => swaggman.convert(123), /Swagger specification file or URI is required/, 'convert() throws when argument is non-string type');
    t.equal(typeof swaggman.convert('swagger'), 'object', 'valid call to convert() returns an object');
    t.end();
});

test('Getters', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: 'abcdef'});
    t.equal(swaggman.swaggerSpecLocation, 'abcdef' , 'swaggerSpecLocation');
    t.equal(swaggman.swaggerJSON, null, 'swaggerJSON');
    t.equal(typeof swaggman.postmanJSON, 'object', 'postmanJSON');
    t.equal(swaggman.saveToFile, true, 'saveToFile');
    t.equal(swaggman.outputFilename, '', 'outputFilename');
    t.end();
});

test('Setters', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = 'abcdef';
    t.equal(swaggman.swaggerSpecLocation, 'abcdef', 'swaggerSpecLocation setter exists');
    t.equal(swaggman.saveToFile, true, 'saveToFile setter exists');
    t.end();
});

test('Output location is configurable', (t) => {
    let swaggman = new SwaggMan();
    t.equal(swaggman.saveToFile, true, 'saveToFile defaults true, write to disk');
    swaggman.saveToFile = false;
    t.equal(swaggman.saveToFile, false, 'saveToFile can set to false, should write to stdout');
    t.throws(() => swaggman.saveToFile = 1234, /saveToFile property expects type boolean/, 'saveToFile throws on invalid parameter types');
    t.end();
});
