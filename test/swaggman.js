'use strict';

const test = require('tape');
const SwaggMan = require('../swaggman');

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
    t.equal(swaggman.outputFilename, '', 'outputFilename');
    t.end();
});

test('Setters', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/swaggerStub.json';
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json', 'swaggerSpecLocation setter exists');
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

test('SwaggerJSON reference is maintained appropriately', (t) => {
    let swaggman = new SwaggMan();
    t.equal(swaggman.swaggerJSON, null, 'Should default to null');
    t.test('====> during instantiation', (st) => {
        let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/swaggerStub.json'});
        st.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json', 'When valid JSON value is provided');
        //st.equal(swaggman.swaggerJSON, {}, 'should be an object');
        st.end();
    });
    t.test('====> on changes to `swaggerSpecLocation` property', (st) => {
        let swaggman = new SwaggMan();
        swaggman.swaggerSpecLocation = __dirname + '/swaggerStub.json';
        st.equal(swaggman.swaggerSpecLocation, __dirname + '/swaggerStub.json', 'using valid JSON location file value');
        st.end();
    });
    t.end();
});

/*
test('Loads Swagger Spec from file', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: '../ref/RingCentral_Swagger_Basic_20161116.json'});
    t.equal(swaggman.swaggerSpecLocation, '../ref/RingCentral_Swagger_Basic_20161116.json', 'Loads from constructor parameter');
    t.equal(swaggman.swaggerJSON, {}, 'Loaded file stored as property `swaggerJSON`');
    t.end();
});
let swaggman = new SwaggMan('https://developers.ringcentral.com/api-explorer/latest/swagger-ring_basic.json');
*/
