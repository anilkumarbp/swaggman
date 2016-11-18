'use strict';

// Deps
require('dotenv').config();

// Vars
const swaggerSpecUri = process.env.RC_SWAGGER_SPEC_URI;

// Fetch the RC Swagger Spec
const getSwaggerFromUri = function(url) {
    // Return new pending promise
    return new Promise((resolve, reject) => {
    if(!url || '' === url) reject(new Error('getSwaggerFromUri must be passed a string representing the URI to the Swagger Specification'));
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // Handle HTTP errors
            if(response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load URL, status code: ', response.statusCode));
            }
            // Placeholder for chunked response
            const body = [];
            response.on('data', (chunk) => {
                body.push(chunk);
            });
            response.on('end', () => {
                resolve(body.join(''));
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
    });
};

// Build the Postman Collection Meta Data
const createCollectionMeta = function(swaggerJSON, postman) {
    try {
        // Define base Postman schema
        const postman       = postman || {};
        postman.info        = {};
        postman.variables   = [];
        postman.items       = [];
        postman.events      = [];

        // Define Postman Info from Environment Variables but default to Swagger properties
        postman.info.name           = (process.env.TITLE) ? process.env.TITLE : swaggerJSON.info.title;
        postman.info.description    = (process.env.DESCRIPTION) ? process.env.DESCRIPTION : swaggerJSON.info.description;
        postman.info.version        = (process.env.POSTMAN_SCHEMA_VERSION) ? process.env.POSTMAN_SCHEMA_VERSION : swaggerJSON.info.version;
        postman.info.schema         = process.env.POSTMAN_SCHEMA_Uri || "https://schema.getpostman.com/json/collection/v2.0.0/collection.json";
    } catch(e) {
        return Promise.reject(e);
    }

    return Promise.resolve(swaggerJSON, postman);
}

// Build the Postman Collection Directory Structures
const createCollectionDirs = function(swaggerJSON, postman) {
    try {

    } catch(e) {
        return Promise.reject(e)
    }
    
    return Promise.resolve(postman);
}

// Write Postman Collection JSON to filename specified
const writePostmanCollection = function(json) {
    return new Promise((resolve, reject) => {
        fs.writeFile(process.env.POSTMAN_JSON_FILENAME_PREFIX + '_' + now + '.json', JSON.stringify(result), 'utf8', (err) => {
            if(err) reject(err);
            else resolve(data);
        });
    });
};

getSwaggerFromUri(swaggerSpecUri)
.then((swagg) => {
    return JSON.parse(swagg);
})
.then(createCollectionMeta)
.then(createCollectionDirs)
.then((postmanDirs) => console.log(postmanDirs))
.catch((err) => console.error(err));

function writePostmanFile(json) {
    if(json) {
        var result = converter.convert(json);
        if('passed' === result.status) {
            var now = +new Date();
            fs.writeFile(process.env.POSTMAN_JSON_FILENAME_PREFIX + '_' + now + '.json', JSON.stringify(result), 'utf8',  function(err) {
                if(err) {
                    console.error(err);
                    throw err;
                } else {
                    console.log('WOOT WOOT!');
                    return;
                }
            });
        }
    }
}

/**
  * Postman schema reference (https://schema.getpostman.com/json/collection/v2/docs/)
  *
  * variables (array) of Variable objects - Variables can be defined and referenced from any part of a request
    * id (string) - Variable ID is a unique user-defined value to identify the variable within a collection (similar to var `name`)
    * value (JS Data Type) - The value that a variable holds in this collection.
    * type (string) - Can have multiple types, this field specifies the type of the variable
    * name (string) - Variable name (used in the replacement strings)
  * info (object)
    * name (string) - Collection Name
    * _postman_id (string) - Postman Collection ID (load from environment variable)
    * description (string) - Describe the Postman Collection
    * schema (string) - https://schema.getpostman.com/json/collection/v2.0.0/collection.json
    * version (string) - semver format
  * items (array) of Folders in the Postman Collection
    * name (string) - 
    * description (string) - 
    * items (array) of API Requests
    * auth (object)
  * events (array) of Event Objects
    * listen (string) - Can be set to `test` or `prerequest` for test scripts or pre-request scripts respectively
    * script (string) - JS code used to perform setup/teardown operations on a particular response
    * disabled (boolean) - Is the event disabled? Defaults to enabled
**/

function convert(swaggerJSON, cb) {
    if(!swaggerJSON || !cb) {
        console.error('convert expects swaggerJSON and callback as parameters');
    } else {
        // Define Postman Folders based on provided mapping but add graceful defaults
    }
}

