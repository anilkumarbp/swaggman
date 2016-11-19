'use strict';

// Deps
require('dotenv').config();

// Vars
const swaggerSpecUri = process.env.RC_SWAGGER_SPEC_URI;

// Get Swagger Spec using HTTP[S], or from local file system
const getSwaggerSpecFile = (swaggerSpec = process.env.SWAGGER_SPEC, ...opts = {}) => {
    if(swaggerSpec.startsWith('http://', 1) || swaggerSpec.startsWith('https://')) {
        // Load from  web server
        return readHttpFile(swaggerSpec);
    } else {
        // Load from local file system
        return readLocalFile(swaggerSpec, opts);
    }
};

// Get file over HTTP[S]
const readHttpFile = (uri) => {
    return new Promise((resolve, reject) => {
        if(!uri || '' === uri) reject(new Error('Missing argument `uri`'));
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // Handle HTTP errors
            if(response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load URL, status code: ${response.statusCode}'));
            }
            // Placeholder for chunked response
            const body = [];
            response.on('data', (chunk) => {
                body.push(chunk);
            });
            response.on('end', () => {
                console.log('Swagger Spec file downloaded.');
                resolve(body.join(''));
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
    });
};

// Get file from local file system, default filename is `swaggerSpec.json`
const readLocalFile = (file = './swaggerSpec.json', ...opts = {}) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, opts, (err, data) => {
            if(err) {
                console.error(err);
                reject(err);
            } else {
                console.log('Swagger Spec file loaded.');
                resolve(data);
            }
        });
    });
};

// Build the Postman Collection Meta Data
const createMeta = function(swagg, postman) {
    console.log('createMeta');
    postman       = postman || {};
    try {
        // Define base Postman schema
        postman.info        = {};
        postman.variables   = [];
        postman.items       = [];
        postman.events      = [];

        // Define Postman Info from Environment Variables but default to Swagger properties
        postman.info.name           = (process.env.TITLE) ? process.env.TITLE : swagg.info.title;
        postman.info.description    = (process.env.DESCRIPTION) ? process.env.DESCRIPTION : swagg.info.description;
        postman.info.version        = (process.env.POSTMAN_SCHEMA_VERSION) ? process.env.POSTMAN_SCHEMA_VERSION : swagg.info.version;
        postman.info.schema         = process.env.POSTMAN_SCHEMA_Uri || "https://schema.getpostman.com/json/collection/v2.0.0/collection.json";
    } catch(e) {
        return Promise.reject(e);
    }

    return Promise.resolve({swg: swagg, pm:postman});
}

// Generate Folders (per the schema, folders are items)
const createFolders = function(config) {
    //TODO: Might want to refactor this and createItems() to be a single method which can identify if the item is a folder or actual item by duck-typing (recursion to save loop-cycles?)
    console.log('createDirs');
    try {
        let folders = [];
        config.swg.tags.forEach((tag) => {
            console.log('Tag: ', tag);
            let folder = {};
            if(tag.name) folder.name = tag.name;
            if(tag.description) folder.description = tag.description;
            if(tag.externalDocs) {
                folder.description += '\n\n';
                folder.description += 'Additional Information: ' + tag.externalDocs.description + ' - ' + tag.externalDocs.url;
            }
            config.pm.items.push(folder);
        });

    } catch(e) {
        return Promise.reject(e)
    }
    
    return Promise.resolve(config);
}

// Populate Items from Swagger Paths into Folder context where applicable
const createItems = function(config) {
    console.log('createItems');
    try {
        let items = [];
        //TODO: Implement the createReqItem(path) to create the necessary structure for the Request Item
        //TODO: Need to make sure to address if the paths['pathString'].tags[0] property matches, push() into the appropriate postman.items.items array
        //TODO: Test that items added into the Postman.items.items array are in the appropriate order
        let pathsObj = config.swg.paths;
        let pathNames = Reflect.ownKeys(pathsObj);

        config.swg.paths.forEach((path, idx, arr) => {
            console.log('Path: ', path);
            let item = {};
            item.name = path.summary;
            item['events'] = [];
            item['request'] = {};
            item['responses'] = [];
        });
    } catch(e) {
        return Promise.reject(e);
    }

    return Promise.resolve(config);
};


/**
  * Item Schema
  *
  * Generate Request Item
  * 
  * "id"
  * "name"
  * [events[
  * {request}
  * [responses]
**/
const createReqItem = function(path) {
    console.log('createReqItem');
    try {
        let req = {};
        reqItem['name'] = path['name'];
        reqItem['event'] = [];
        reqItem['request'] = {};
        reqItem['response'] = [];
    } catch(e) {
    }

    return reqItem;
};

/** 
  * urlBuilder
**/
const urlBuilder = (domain) => {
    domain = domain ? domain : process.env.HOST;
    let parts = [];
    let proxy = new Proxy(() => {
        let retrunValue = domain + '/' + parts.join('/');
        parts = [];
        return returnValue;
    }, {
        has: () => {
            return true;
        },
        get: (object, prop) => {
            parts.push(prop);
            return proxy;
        },
    });
    return proxy;
};

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
.then(createMeta)
.then(createFolders)
.then(createItems)
.then((config) => console.log(config.pm))
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

function convert(swaggerJSON, cb) {
    if(!swaggerJSON || !cb) {
        console.error('convert expects swaggerJSON and callback as parameters');
    } else {
        // Define Postman Folders based on provided mapping but add graceful defaults
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
  * info (object) - Meta data about the collection
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

/**
  * Swagger schema reference (http://swagger.io/specification/)
  *
  * swagger (string) - version of Swagger itself
  * info (object) - Meta data about the spec
  * host (string) - Host portion of URI
  * basePath (string) - Base path where API is served relative to host
  * schemes (string) - Transfer protocol of the API
  * consumes (string) - List of MIME types the APIs can consume (global to all APIs, but can be overridden on specific API calls)
  * produces (string) - Inverse of consumes
  * paths [Paths Object] - The available paths and operations for the API
  * definitions [Definitions Object] - An object to hold data types produced and consumed by operations
  * parameters [Parameters Definitions Object] - Object to hold parameters that can be used across operations (does not define global params for all ops)
  * responses [Responses Definitions Object] - Object to hold responses that can be used across operations (does not define global responses for all ops)
  * securityDefinitions [securityDefinitionsObject] - Security scheme definitions that can be used across the spec
  * tags [Tag Object] - List of tags used by spec with additional metadata. Order of tags can be used to reflect on their order by the parsing tools. Not all tags used by Operation Object must be declared. Undeclared tags may be organized randomly or based on tool logic. Must be unique 
  * externalDocs ExternalDocumentationObject - Additional external docs
**/

