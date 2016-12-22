'use strict';

// Dependencies
const fs        = require('fs');
const test      = require('tape');
const SwaggMan  = require('../swaggman');

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
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/swaggerStub.json'});
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json' , 'swaggerSpecLocation');
    t.equal(typeof swaggman.swaggerJSON, 'object', 'swaggerJSON');
    t.equal(typeof swaggman.postmanJSON, 'object', 'postmanJSON');
    t.equal(swaggman.saveToFile, true, 'saveToFile');
    if(!process.env.OUTPUT_FILENAME) {
        t.equal(swaggman.outputFilename, 'RingCentral_API_Postman2Collection.json', 'outputFilename');
    }
    process.env.OUTPUT_FILENAME = '123.json';
    let s2 = new SwaggMan();
    t.equal(s2.outputFilename, '123.json', 'Accepts filename from environment variable');
    process.env.OUTPUT_FILENAME = '';
    t.end();
});

test('Setters', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/swaggerStub.json';
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json', 'swaggerSpecLocation setter exists');
    t.equal(swaggman.saveToFile, true, 'saveToFile setter exists');
    t.equal(swaggman.outputFilename, 'RingCentral_API_Postman2Collection.json', 'outputFilename setter exists');
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

test('SwaggerJSON defaults to null', (t) => {
    let swaggman = new SwaggMan();
    t.equal(swaggman.swaggerJSON, null, 'Should default to null');
    t.end();
});

test('SwaggerJSON can be set during instantiation', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/swaggerStub.json'});
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json', 'When valid JSON value is provided');
    //st.equal(swaggman.swaggerJSON, {}, 'should be an object');
    t.end();
});

test('SwaggerJSON reference is updated using `swaggerSpecLocation` setter', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/swaggerStub.json';
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json', 'using valid JSON location file value');
    t.end();
});

test('Can save converted Postman Collection to local filesystem', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/swaggerStub.json';
    let c = swaggman.convert();
    t.ok(() => fs.readFileSync(__dirname + '/' + process.env.POSTMAN_OUTPUT_FILENAME + '.json'));
    t.end();
});

test('Generates output filename', (t) => {
    let swaggman = new SwaggMan();
    swaggman.outputFilename = 'SuperPostmanFile.json';
    t.equal(swaggman.outputFilename, 'SuperPostmanFile.json', 'Uses sane defaults');
    t.end();
});

test('Save to filesystem as configured', (t) => {
    t.fail('TODO!!! When saveToFile is true (default), save Postman to configured file on disk');
    t.end();
});

test('Output to stdout as configured', (t) => {
    t.fail('TODO!!! When saveToFile is false, output Postman to stdout');
    t.end();
});

/* --> Future feature
test('Can POST converted Postman Collection defined endpoint', (t) => {
    t.end();
});
*/
