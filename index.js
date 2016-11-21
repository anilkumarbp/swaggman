/**
  * SwaggMan
  *
  * Description: Simple tool for converting Swagger2 spec to Postman2 Collection Spec
  * Author: Benjamin Dean (https://github.com/bdeanindy)
  * Postman schema reference (https://schema.getpostman.com/json/collection/v2/docs/)
  * Swagger schema reference (http://swagger.io/specification/)
**/

'use strict';

// Deps
require('dotenv').config();
const fs = require('fs');
const uuid = require('node-uuid');

// App Vars
let swaggerJSON = null;
// Based on Postman 2 Schema
let postmanJSON = {
    info      : {},
    variables : [],
    items     : [],
    events    : [],
    auth      : {}
};

// Get Swagger Spec using HTTP[S], or from local file system
const getSwaggerSpecFile = (swaggerSpec) => {
    swaggerSpec = swaggerSpec || process.env.SWAGGER_SPEC;
    if(swaggerSpec.startsWith('http://', 1) || swaggerSpec.startsWith('https://')) {
        // Load from  web server
        return readHttpFile(swaggerSpec);
    } else {
        // Load from local file system
        return readLocalFile(swaggerSpec);
    }
};

// Get file over HTTP[S]
const readHttpFile = (uri) => {
    return new Promise((resolve, reject) => {
        if(!uri || '' === uri) reject(new Error('Missing argument `uri`'));
        const lib = uri.startsWith('https') ? require('https') : require('http');
        const request = lib.get(uri, (response) => {
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

// Get file from local file system, default filename is `swagger.json` (per the Swagger 2.0 convention for the spec)
const readLocalFile = (file) => {
    file = file || './swagger.json';
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
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

// Converts Swagger Info to Postman Collection Info, allowing developers to override defaults with environment configs
const convertInfo = function() {
    console.log('convertInfo');
    let info = {};
    try {
        // Define Postman Info from Environment Variables but default to Swagger properties
        info._postman_id    = process.env.POSTMAN_ID            || uuid.v4();
        info.version        = process.env.API_VERSION           || swaggerJSON.info.version;
        info.name           = process.env.POSTMAN_TITLE         || swaggerJSON.info.title;
        info.schema         = process.env.POSTMAN_SCHEMA_URI    || 'https://schema.getpostman.com/json/collection/v' + process.env.POSTMAN_SCHEMA_SEMVER + '/collection.json';
        info.description    = process.env.POSTMAN_DESCRIPTION   || swaggerJSON.info.description;
        // No place to map in Postman, adding to description 
        if(swaggerJSON.info.termsOfService) info.description    += '\n\n' + swaggerJSON.info.termsOfService;
        if(swaggerJSON.info.contact) info.description           += '\n\n' + swaggerJSON.info.contact;
        if(swaggerJSON.info.license) info.description           += '\n\n' + swaggerJSON.info.license;
    } catch(e) {
        return Promise.reject(e);
    }

    console.log('Info: ', info);
    return Promise.resolve(info);
}

// Generate Folders (Swagger Tags become Postman Folders)
const generateFolders = () => {
    console.log('generateFolders');
    let folders = [];
    let tags = swaggerJSON.tags;
    console.log('swaggerJSON.tags: ', swaggerJSON.tags);
    if(!tags && process.env.IMPLEMENT_TAGS_AS_FOLDERS) {
        return Promise.reject(new Error('generateFolders expects swaggerJSON.tags to be an array and contain elements, or environment variable IMPLEMENT_TAGS_AS_FOLDERS to be set to false'));
    } else {
        // Populate Postman Collection with folders
        for(let tag of tags) {
            console.log('Tag: ', tag.name);
            folders.push(convertTagToFolder(tag));
        }
    }
    console.log('Folders: ', folders);
    return Promise.resolve(folders);
};

// Generate Items
const generateItems = () => {
    console.log('generateItems');
    let postmanItems = [];
    try {
        // If we do not have a path, we are generating a ROOT Item
        // If we have a path, but no verb, we are generating a FOLDER Item (need to iterate over the path to generate items for each verb)
        // Add items to the appropriate FOLDER(S) based on path[VERB]['tags'][...FOLDER_NAMES]
        // Iterate over the paths
        //console.log('swaggerJSON.paths: ', swaggerJSON.paths);
        let paths = Object.keys(swaggerJSON.paths); // Swagger.paths[routeName] which is the routeName
        //console.log('Iterating paths: ', paths);
        for(let path of paths) {
            // Iterate the verbs for each path
            let verbs = Object.keys(swaggerJSON.paths[path]);
            console.log('Building Items for Path: ', path);
            for(let verb of verbs) {
                // Create new item for each verb within each path
                let item = {};
                console.log('Creating Item for Verb: ', verb);
                // Generate Item
                item.name = swaggerJSON.paths[path][verb].summary;
                item.id = swaggerJSON.paths[path][verb].operationId;
                item['events'] = [];
                item['request'] = generateRequestObject(path, verb);
                item['responses'] = [];
                //console.log('Item: ', item);
                postmanItems.push(item);
                console.log('Done with items');
            }
            console.log('Done with paths');
        }
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    } catch(e) {
        return Promise.reject(e)
    }
    return Promise.resolve(postmanItems);
};

const generateRequestObject = (path, verb) => {
    console.log('createReqItem');
    return {
        url: generateUrlObject(path, verb),
        auth: path['auth'],
        method: verb,
        headers: [],
        body: {}
    };
};

const generateUrlObject = (path, verb) => {
    console.log('generateUrlObject');
    // TODO: Add config for devs to set `url` to a string instead of an object
    // TODO: Add config for variables
    // TODO: Add generateUrlVariables method
    return {
        protocol: '',
        domain: [],
        path: [],
        port: '',
        query: generateQueryParamObject(path, verb),
        hash: '',
        variables: []
    };
};

const generateQueryParamObject = (path, verb) => {
};

const generateEventObject = (path) => {
};

const generateVariableObject = () => {
};

const convertTagToFolder = (tag) => {
    console.log('convertTagToFolder');
    return {
        name: tag.name,
        description: tag.description,
        items: [],
        auth: process.env.POSTMAN_FOLDER_AUTH_HELPER
    };
};

/** 
  * urlBuilder
  *
  * Used for building the Postman URL property for Collection.item.request.url
  * Returns url with parts separated by '/'
  * Example Usage:
  * let ringCentral = urlBuilder('https://platform.devtest.ringcentral.com/restapi/v1.0');
  * ringCentral.account.~.extension.~.presence; // https://platform.devtest.ringcentral.com/restapi/v1.0/account/~/extension/~/presence
**/
const urlBuilder = (base) => {
    base = base ? base : process.env.HOST;
    let parts = [];
    let proxy = new Proxy(() => {
        let retrunValue = base + '/' + parts.join('/');
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

// Generates the filename of the Postman Collection which will be written to disk. Defaults to 'postmanCollection_' + timestamp + '.json'
const generatePostmanCollectionOutputFilename = () => {
    console.log('generatePostmanCollectionOutputFilename');
    let prefix = process.env.POSTMAN_OUTPUT_FILENAME || 'postmanCollection';
    let timestamp = (process.env.INCLUDE_TIMESTAMP_IN_POSTMAN_OUTPUT_FILENAME) ? '_' + +new Date() + '_' : '';
    let suffix = (process.env.POSTMAN_OUTPUT_FILENAME_SUFFIX) ? '_' + process.env.POSTMAN_OUTPUT_FILENAME_SUFFIX : '';
    let filename = prefix + timestamp + suffix + '.json';
    console.log('Output file name will be: ', filename);
    return prefix + timestamp + suffix;
}

// Write Postman Collection JSON to filename specified
const writePostmanCollection = function() {
    console.log('writePostmanCollection');
    return new Promise((resolve, reject) => {
        fs.writeFile(generatePostmanCollectionOutputFilename(), JSON.stringify(postmanJSON), 'utf8', (err) => {
            if(err) reject(err);
            else resolve('File written to disk!');
        });
    });
};

const convert = (swaggerSpec) => {
    swaggerSpec = swaggerSpec || process.env.SWAGGER_SPEC;
    if(!swaggerSpec || '' === swaggerSpec) {
        throw new Error('Missing the swagger specification file reference');
    }
    getSwaggerSpecFile(swaggerSpec)
    .then((swagg) => {
        swaggerJSON = JSON.parse(swagg);
    })
    .then(convertInfo)
    .then((info) => {
        if(info) postmanJSON.info = info;
    })
    .then(generateFolders)
    .then((folders) => {
        if(folders && folders.length) postmanJSON.items = folders;
    })
    .then(generateItems)
    .then((items) => {
        if(items && 0 < items.length) postmanJSON.items.concat(items);
    })
    .then(writePostmanCollection)
    .then((msg) => {
        if(msg) console.log(msg);
    })
    .catch((err) => console.error(err));
}

convert();
