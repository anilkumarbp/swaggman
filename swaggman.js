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
const translate = require('./lib/translator');

class SwaggMan {

    constructor(options = {}) {
        this._swaggerSpecLocation = options.swaggerSpecLocation || process.env.SWAGGER_SPEC_LOCATION;
        this._saveToFile = options.saveToFile || true; // Default to true
        this._outputFilename = process.env.OUTPUT_FILENAME || options.outputFilename || 'RingCentral_API_Postman2Collection.json';
        this._swaggerJSON = null;
        this._postmanJSON = {};
        this._signature = options.signature || process.env.SIGNATURE;
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

    convert(swaggerSpec) {
        swaggerSpec = swaggerSpec || this._swaggerSpecLocation;
        if(!swaggerSpec || 'string' !== typeof swaggerSpec) {
            throw new Error('Swagger specification file or URI is required');
        }

        return loader.load(swaggerSpec)
        .then(function(result) {
            result = JSON.parse(result);
            this._postmanJSON['info']       = translate.info(result);
            this._postmanJSON['item']       = translate.items(result);
            this._postmanJSON['event']      = translate.events(result);
            this._postmanJSON['variables']  = translate.variables(result);
            this._postmanJSON['auth']       = translate.auth(result);
            //console.log('CONVERT RESULT: ', this._postmanJSON);
            return this._postmanJSON;
        }.bind(this))
        .catch(function(e) {
            console.error(e);
            throw e;
        });
    }

    finish(options) {
        return new Promise((resolve, reject) => {
            let postmanJSON = (options && options.postmanJSON) ? options.postmanJSON : this.postmanJSON;
            postmanJSON = JSON.stringify(postmanJSON);
            let dest = this.outputFilename;
            let isUri = (dest.startsWith('http://', 1) || dest.startsWith('https://')) ? true : false;

            // Return data to caller for their use
            if(!this._saveToFile && !isUri) {
                resolve(postmanJSON);
            }

            // Handle URL POST
            if(this._saveToFile && isUri) {
                const lib = (dest.startsWith('https')) ? require('https') : require('http');
                const parsedUrl = url.parse(dest);
                parsedUrl.method = 'POST';
                parsedUrl.headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postmanJSON),
                    'X-Swaggman-Signature': this._signature
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

                request.write(postmanJSON);
                request.end();
            }

            // Handle filename
            if(this.saveToFile && !isUri) {
                // Prefix with path local to this module if not specified, in the future improve this to use Node.Path module
                if(!dest.startsWith('./') && !dest.startsWith('../') && !dest.startsWith('/')) {
                    dest = './' + dest
                }
                fs.writeFile(dest, postmanJSON, (err) => {
                    if(err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve('Postman Collection file, `' + dest + '` has been written to disk!');
                    }
                });
            }
        });
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

    get outputFilename() {
        return this._outputFilename;
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

    set outputFilename(value) {
        if('string' !== typeof value) {
            throw new Error('Invalid type used setting SwaggMan.outputFilename');
        }
        if(value && 'string' === typeof value && -1 !== value.indexOf('.json')) {
            this._outputFilename = value;
        }
    }

}

module.exports = SwaggMan;
