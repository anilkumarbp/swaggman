'use strict';
/**
  * SwaggMan
  *
  * Author: Benjamin M. Dean
  * Description: Simple tool to convert Swagger 2 Spec to Postman 2 Collection Spec
  * Created: December 2016
**/

// Dependencies
if('production' !== process.env.NODE_ENV) require('dotenv').config(); // Only used for local development and usage
const fs = require('fs');
const url = require('url');
const loader = require('./lib/assetLoader');
const path = require('path');
const translate = require('./lib/translator');

class SwaggMan {

    constructor(options = {}) {
        this._swaggerSpecLocation   = options.swaggerSpecLocation || process.env.SWAGGER_SPEC_LOCATION;
        this._saveToFile            = options.saveToFile || false; // Default to false
        this._saveToUri             = options.saveToUri || false; // Default to false
        this._saveToStdout          = options.saveToStdout || true; // Defaul to false
        this._outputFilename        = options.outputFilename || process.env.OUTPUT_FILENAME || null;
        this._outputUri             = options.outputUri || process.env.OUTPUT_URI || null;
        this._signature             = options.signature || process.env.SIGNATURE;
        this._swaggerJSON           = options.swaggerJSON || null;
        this._postmanJSON           = {} ;
        this._eventHelpersDirectory = options.eventHelpersDirectory || process.env.EVENT_HELPERS_DIRECTORY || 'helpers';
        if(this._swaggerSpecLocation) {
            loader.load(this._swaggerSpecLocation)
            .then(function(result) {
                this._swaggerJSON = JSON.parse(result);
            }.bind(this))
            .catch(function(e) {
                console.error(e);
                throw e;
            });
        }
    }

    convert(swaggerSpec = this._swaggerSpecLocation) {
        //swaggerSpec = swaggerSpec || this._swaggerSpecLocation;
        if(!swaggerSpec || 'string' !== typeof swaggerSpec) {
            throw new Error('Swagger specification file or URI is required');
        }

        return loader.load(swaggerSpec)
        .then((result) => {
            // TODO!!!!!!!!!!!!!! MUST REFACTOR TO WORK WITH NEW ES6 STRUCTURE !!!!!!!!!!!!!!!!!!!!!!!!
            result = JSON.parse(result);
            this._postmanJSON['info']       = translate.info(result.info);
            //TODO: NEED TO FIX EVENTS ---> this._postmanJSON['item']       = translate.items(result);
            //TODO: NEED TO FIX EVENTS ---> this._postmanJSON['event']      = translate.events(result);
            //TODO: NEED TO FIX VARIABLES ---> this._postmanJSON['variables']  = translate.variables(result);
            //TODO: NEED TO FIX AUTH TO WORK WITH SWAGGER SECURITY OR SET SANE DEFAULTS----> this._postmanJSON['auth']       = translate.auth(result);
            return {postmanCollection: this._postmanJSON};
        })
        .catch(function(e) {
            console.error(e);
            throw e;
        });
    }

    writePostmanStdout(postmanData = this._postmanJSON) {
        if(!postmanData) throw new Error('HOLY WHIPPED CREAM BATMAN! The postmanData must be supplied or converted before SwaggMan can do anything with it!');
        return process.stdout.write(JSON.stringify(postmanData));
    }

    writePostmanFile({dest = this._outputFilename, postmanData = this._postmanJSON} = {}) {
        return new Promise((reject, resolve) => {
            if(!dest) throw new Error('Missing required parameter `dest`, cannot writePostmanFile');
            if(!postmanData) throw new Error('Missing required parameter `postmanData`, cannot writePostmanFile');
            // Prefix with path local to this module if not specified, in the future improve this to use Node.Path module
            if(!dest.startsWith('./') && !dest.startsWith('../') && !dest.startsWith('/')) {
                dest = './' + dest
            }
            fs.writeFile(dest, postmanData, (err) => {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve('Postman Collection file, `' + dest + '` has been written to disk!');
                }
            });
        });
    }

    writePostmanUri({uri = this._outputUri, postmanData = this._postmanJSON, signature = this._signature}) {
        return new Promise((reject, resolve) => {
            // Handle errors first...
            if(!uri) throw new Error('Unable to initiate HTTP POST request, no URI specified');
            if(!signature) throw new Error('Unable to initiate HTTP POST request, missing X-Swaggman-Signature value');
            let parsedUri = url.parse(uri);
            if(!parsedUri || !parsedUri.protocol || !parsedUri.hostname) throw new Error('Unable to initiate HTTP POST request, supplied URI invalid');

            const lib = (parsedUri.protocol.startsWith('https')) ? require('https') : require('http');
            parsedUrl.method = 'POST';
            parsedUrl.headers = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(postmanData)),
                'X-Swaggman-Signature': signature
            };

            const request = lib.request(parsedUrl, (res) => {
                // Handle HTTP errors
                if(res.statusCode < 200 || res.statusCode > 299) {
                    reject(new Error('Failed to load URL, status code: ${response.statusCode}'));
                }
                // Placeholder for chunked response
                const body = [];
                res.on('data', (chunk) => {
                    body.push(chunk);
                });
                res.on('end', () => {
                    resolve(body.join(''));
                });
            });

            request.on('error', (err) => {
                console.error(err);
                reject(err);
            });

            request.write(JSON.stringify(postmanData));
            request.end();
        });
    }

    finish({saveToFile = this.saveToFile, saveToUri = this.saveToUri, saveToStdout = this.saveToStdout} = {}) {
        //console.log('saveToFile: ', saveToFile);
        //console.log('saveToUri: ', saveToUri);
        //console.log('this: ', this);
        if(saveToFile) {
            //console.log('Finish returning saveToFile');
            this.writePostmanFile();
        }

        if(saveToUri) {
            //console.log('Finish returning saveToUri');
            this.writePostmanUri();
        }

        // Default is to write to stdout
        if(saveToStdout) {
            //console.log('Finish returning postmanStdout');
            return this.writePostmanStdout();
        }
    }

    // GETTERS
    get swaggerSpecLocation() {
        return this._swaggerSpecLocation;
    }

    get swaggerJSON() {
        return this._swaggerJSON;
    }

    get postmanJSON() {
        return this._postmanJSON;
    }

    get saveToFile() {
        return this._saveToFile;
    }

    get saveToStdout() {
        return this._saveToStdout;
    }

    get saveToUri() {
        return this._saveToUri;
    }

    get outputFilename() {
        return this._outputFilename;
    }

    get outputUri() {
        return this._outputUri;
    }

    get eventHelpersDirectory() {
        return this._eventHelpersDirectory;
    }

    // SETTERS
    set swaggerSpecLocation(value) {
        this._swaggerSpecLocation = value;
        loader.load(value)
        .then(function(result) {
            this._swaggerJSON = JSON.parse(result);
        }.bind(this))
        .catch(function(e) {
            console.error(e);
            throw e;
        });
    }

    set saveToFile(value) {
        if('boolean' !== typeof value) {
            throw new Error('saveToFile property expects type boolean');
        }
        this._saveToFile = value;
    }

    set saveToStdout(value) {
        if('boolean' !== typeof value) {
            throw new Error('saveToStdout property expects type boolean');
        }
        this._saveToStdout = value;
    }

    set saveToUri(value) {
        if('boolean' !== typeof value) {
            throw new Error('saveToUri property expects type boolean');
        }
        this._saveToUri = value;
    }

    set outputFilename(value) {
        if('string' !== typeof value) {
            throw new Error('Invalid type used setting SwaggMan.outputFilename');
        }
        if(value && 'string' === typeof value && -1 !== value.indexOf('.json')) {
            this._outputFilename = value;
        }
    }

    set outputUri(value) {
        if('string' !== typeof value && -1 !== value.indexOf('.json')) {
            throw new Error('Invalid value, outputUri must be a string ending in .json');
        }
        this._outputUri = value;
    }

    set eventHelpersDirectory(value) {
        let normalizedPath = path.normalize(value);
        let helpers = fs.readdirSync(normalizedPath);
        if(-1 === helpers.indexOf('index.js')) {
            throw new Error('eventHelpersDirectory path is valid, but does not contain the required `index.js` file');
        } else {
            this._eventHelpersDirectory = normalizedPath;
        }
    }

}

module.exports = SwaggMan;
