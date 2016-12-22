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
    t.end();
});

test('convert()', (t) => {
    let swaggman = new SwaggMan();
    t.equal(typeof swaggman.convert, 'function', 'Exposes convert() method');
    t.throws(() => swaggman.convert(123), /Swagger specification file or URI is required/, 'convert() throws when argument is non-string type');
    t.end();
});

test('finish()', (t) => {
    let swaggman = new SwaggMan(__dirname + '/RCSwagger_20161116.json');
    t.equal(typeof swaggman.finish, 'function', 'Exposes finish() method');

    // Save to file on disk by default
    swaggman.convert()
    .then(function(pmData) {
        swaggman.finish(pmData);
    }.bind(this))
    .then((resolution) => {
        console.log('FINAL RESOLUTION: ', resolution);
    })
    .catch(function(e) {
        console.error(e);
        throw e;
    });
    t.ok(() => fs.readFileSync(__dirname + '/' + swaggman.outputFilename));

    // Should return value to caller 
    swaggman.saveToFile = false;
    swaggman.finish()
    .then((result) => {
        t.pass(result);
    })
    .catch(function(e) {
        t.fail(e);
    });
    
    // Should POST to provided endpoint

    t.end();
});

test('Getters', (t) => {
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/RCSwagger_20161116.json'});
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json' , 'swaggerSpecLocation');
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
    swaggman.swaggerSpecLocation = __dirname + '/RCSwagger_20161116.json';
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json', 'swaggerSpecLocation setter exists');
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
    let swaggman = new SwaggMan({swaggerSpecLocation: __dirname + '/RCSwagger_20161116.json'});
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json', 'When valid JSON value is provided');
    //st.equal(swaggman.swaggerJSON, {}, 'should be an object');
    t.end();
});

test('SwaggerJSON reference is updated using `swaggerSpecLocation` setter', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/RCSwagger_20161116.json';
    t.equal(swaggman.swaggerSpecLocation, __dirname + '/RCSwagger_20161116.json', 'using valid JSON location file value');
    t.end();
});

test('Can save converted Postman Collection to local filesystem', (t) => {
    let swaggman = new SwaggMan();
    swaggman.swaggerSpecLocation = __dirname + '/RCSwagger_20161116.json';
    swaggman.convert();

    swaggman.finish()
    .then((result) => {
        console.log(result);
        t.ok(() => fs.readFileSync(__dirname + '/' + process.env.POSTMAN_OUTPUT_FILENAME + '.json'), 'The file was successfully written to disk');
    })
    .catch((e) => {
        console.error(e);
        t.fail(e);
    });
    t.end();
});

test('Generates output filename', (t) => {
    let swaggman = new SwaggMan();
    swaggman.outputFilename = 'SuperPostmanFile.json';
    t.equal(swaggman.outputFilename, 'SuperPostmanFile.json', 'Uses sane defaults');
    t.end();
});

/* --> Future feature
test('Can POST converted Postman Collection defined endpoint', (t) => {
    t.end();
});
*/
