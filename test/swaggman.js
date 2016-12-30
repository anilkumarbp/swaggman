'use strict';

// Dependencies
const fs        = require('fs');
const tape      = require('tape');
const _test     = require('tape-promise').default;
const test      = _test(tape); // decorate tape
const SwaggMan  = require('../swaggman');

test('Swaggman Class', (t) => {
    let swaggman = new SwaggMan();
    t.comment('Constructor');
    t.equal(typeof SwaggMan, 'function', 'Can be instantiated');
    t.ok(swaggman, 'Can be instantiated with no arguments');
    t.equal(swaggman instanceof SwaggMan, true, 'Instances have the proper prototype');
    t.end();
});

test('convert()', (t) => {
    let swaggman = new SwaggMan({outputFilename: 'convertTestFilename.json'});
    t.equal(typeof swaggman.convert, 'function', 'Exposes convert() method');
    t.throws(() => swaggman.convert(123), /Swagger specification file or URI is required/, 'convert() throws when argument is non-string type');
    t.end();
});

test('finish()', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/RCSwagger_20161116.json', outputFilename: 'convertTestFilename.json'});
    t.equal(typeof swaggman.finish, 'function', 'Exposes finish() method');
    t.doesNotThrow(() => {swaggman.finish()}, null, 'When called without parameters, accepts instance members or defaults');
    t.doesNotThrow(() => {swaggman.finish({saveToFile: false})}, null, 'Accepts boolean for saveToFile');
    t.doesNotThrow(() => {swaggman.finish({saveToUri: false, saveToFile: false, saveToStdout: false})}, null, 'Can set all three parameters simultaneously');
    t.end();
});

test('Can write postman output to local filesystem', (t) => {
    let swaggman = new SwaggMan({outputFilename: 'writeToFileTest.json'});
    t.ok(swaggman.writePostmanStdout, 'Expose method for writing converted Postman Collection to stdout');
    swaggman.saveToFile = true;
    swaggman.swaggerSpecLocation = __dirname + '/RCSwagger_20161116.json';
    swaggman.convert();
    t.ok(() => {fs.readFileSync(swaggman.outputFilename)}, 'File is written successfully');
    t.doesNotThrow(() => {swaggman.writePostmanStdout()}, null, 'Operates with defaults');
    t.doesNotThrow(() => {swaggman.writePostmanStdout({})}, null, 'Accepts object as only parameter');
    t.end();
});

test('writePostmanFile()', (t) => {
    let swaggman = new SwaggMan();
    t.ok(swaggman.writePostmanFile, 'Should support saving converted Postman Collection to file on disk');
    t.equal(typeof swaggman.writePostmanFile, 'function', 'writePostmanFile is a function');
    t.end();
});

test('writePostmanUri()', (t) => {
    let swaggman = new SwaggMan();
    t.ok(swaggman.writePostmanUri, 'Should support sending converted Postman Collection using HTTP');
    t.equal(typeof swaggman.writePostmanUri, 'function', 'writePostmanUri is a function');
    t.end();
});

test('Getters', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/RCSwagger_20161116.json', outputFilename: 'testOutputFilename.json', outputUri: 'testOutputUri.json'});
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json' , 'swaggerSpecLocation');
    t.equal(typeof swaggman.swaggerJSON, 'object', 'swaggerJSON');
    t.equal(typeof swaggman.postmanJSON, 'object', 'postmanJSON');
    t.equal(typeof swaggman.eventHelpersDirectory, 'string', 'eventHelpersDiretory'); 
    t.equal(swaggman.saveToFile, false, 'saveToFile');
    t.equal(swaggman.outputFilename, 'testOutputFilename.json', 'outputFilename');
    t.equal(swaggman.outputUri, 'testOutputUri.json', 'outputUri');

    process.env.OUTPUT_FILENAME = '123.json';
    let s2 = new SwaggMan();
    t.equal(s2.outputFilename, '123.json', 'Accepts filename from environment variable');
    t.end();
});

test('Setters', (t) => {
    let swaggman = new SwaggMan();
    swaggman.eventHelpersDirectory = 'helpers';
    t.ok(swaggman.outputFilename = 'setterTestFilename.json', 'outputFilename can be set');
    t.equal(swaggman.outputFilename, 'setterTestFilename.json', 'outputFilename setter operates properly');
    t.ok(swaggman.outputUri = 'setterTestUri.json', 'outputUri can be set');
    t.equal(swaggman.outputUri, 'setterTestUri.json', 'outputUri setter operates properly');
    t.ok(swaggman.swaggerSpecLocation = __dirname + '/RCSwagger_20161116.json', 'swaggerSpecLocation can be set');
    t.equal(swaggman.swaggerSpecLocation, '/Users/benjamin.dean/MyApps/swaggman/test/RCSwagger_20161116.json', 'swaggerSpecLocation setter operates properly');
    t.ok(swaggman.eventHelpersDirectory = 'helpers', 'eventHelpersDirectory can be set');
    t.equal(swaggman.eventHelpersDirectory, 'helpers', 'eventHelpersDirectory setter operates properly');
    t.ok(swaggman.saveToFile = true, 'saveToFile can be set');
    t.equal(swaggman.saveToFile, true, 'saveToFile setter operates properly');
    t.ok(swaggman.saveToUri = true, 'saveToUri can be set');
    t.equal(swaggman.saveToUri, true, 'saveToUri setter operates properly');
    t.ok(swaggman.saveToStdout = true, 'saveToStdout can be set');
    t.equal(swaggman.saveToStdout, true, 'saveToStdout setter operates properly');
    t.end();
});

test('SwaggerJSON defaults to null', (t) => {
    let swaggman = new SwaggMan();
    t.equal(swaggman.swaggerJSON, null, 'Should default to null');
    t.end();
});

test('SwaggerJSON can be set during instantiation', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/RCSwagger_20161116.json'});
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json', 'When valid JSON value is provided');
    t.end();
});

test('Swaggman.swaggerJSON property is updated when `swaggerSpecLocation` is set', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/RCSwagger_20161116.json';
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json', 'using valid JSON location file value');
    t.end();
});

test('Can generate output filename', (t) => {
    let swaggman = new SwaggMan();
    swaggman.outputFilename = 'SuperPostmanFile.json';
    t.equal(swaggman.outputFilename, 'SuperPostmanFile.json', 'Uses sane defaults');
    t.end();
});
