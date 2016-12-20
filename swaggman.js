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
const loader = require('./lib/assetLoader');

class SwaggMan {

    constructor(options = {}) {
        this._swaggerSpecLocation = options.swaggerSpecLocation || process.env.SWAGGER_SPEC_LOCATION;
        this._saveToFile = options.saveToFile || true;
        this._outputFilename = options.outputFilename || '';
        this._swaggerJSON = null;
        this._postmanJSON = {};
    }

    convert(swaggerSpec) {
        swaggerSpec = swaggerSpec || this._swaggerSpecLocation;
        if(!swaggerSpec || 'string' !== typeof swaggerSpec) {
            throw new Error('Swagger specification file or URI is required');
        }
        return this._postmanJSON;
    }

    _outputPostman(postmanJSON) {
        // TODO!! Complete based on configurations
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
        this._swaggerJSON = loader.load(value);
        this._swaggerSpecLocation = value;
    }

    set saveToFile(value) {
        if('boolean' !== typeof value) {
            throw new Error('saveToFile property expects type boolean');
        }
        this._saveToFile = value;
    }

}

module.exports = SwaggMan;
