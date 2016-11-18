'use strict';

// Deps
var fs = require('fs');
var http = require('http');
var request = require('request');

// Vars
var swaggerSpecURI = process.env.RC_SWAGGER_SPEC_URI;
var swaggerJSON = null;

// Fetch the RC Swagger Spec
request(swaggerSpecURI, function(error, response, body) {
    if(!error && 200 === response.statusCode) {
        console.log('RC Swagger Received');
        swaggerJSON = JSON.parse(body);
        convert(swaggerJSON, function(err, data) {
            if(err) {
                console.error(err);
                throw err;
            } else {
                console.log('CONVERTED!');
                writePostmanFile(data);
            }
        });
    } else {
        console.error(error);
        throw error;
    }
});

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
        // Define base Postman schema
        var postman         = {};
        postman.info        = {};
        postman.variables   = [];
        postman.items       = [];
        postman.events      = [];

        // Define Postman Info from Environment Variables but default to Swagger properties
        postman.info.name = (process.env.TITLE) ? process.env.TITLE : swaggerJSON.info.title;
        postman.info.description = (process.env.DESCRIPTION) ? process.env.DESCRIPTION : swaggerJSON.info.description;
        postman.info.schema = process.env.POSTMAN_SCHEMA_URI || "https://schema.getpostman.com/json/collection/v2.0.0/collection.json";
        postman.info.version = process.env.POSTMAN_SCHEMA_VERSION || swaggerJSON.version;

        // Define Postman Folders based on provided mapping but add graceful defaults
    }
}
