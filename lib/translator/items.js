'use strict';

// Dependencies
const mapify    = require('es6-mapify');
const uuid      = require('node-uuid');
const events    = require('./events');
const requests  = require('./requests');

// CONSTANTS
const validPostmanMethods   = ['get', 'put', 'post', 'patch', 'delete', 'copy', 'head', 'options', 'link', 'unlink', 'purge', 'lock', 'unlock', 'propfind', 'view'];
const validPathProperties   = ['$ref', 'get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'parameters'];
const requiredSwaggerProps  = ['swagger', 'info', 'paths'];
const excludeTags           = ['OAuth2'];

// UTILITIES
const findByAttr = (array, attr, value) => {
    for(let i = 0; i < array.length; i++) {
        if(array[i].name.match(attr)) return i;
    }
    return -1;
};

// Creates a map from an object
function* entries(obj) {
    for( let key in obj) 
        yield [key, obj[key]];
};

// Used to prevent accessing private properties
const invariant = (key, action) => {
    if('_' === key[0]) throw new Error(`Invalid attempt to ${action} private "${key}" property`);
};
// Prevent mutating Swagger Spec
const notPermitted = () => {
    throw new Error('Modifying the Swagger specification is not permitted');
};

const readOnlyView = (target) => {
    return new Proxy(target, readOnlyHandlers);
};

const readOnlyHandlers = {
    set: notPermitted,
    defineProperty: notPermitted,
    deleteProperty: notPermitted,
    preventExtensions: notPermitted,
    setPrototypeOf: notPermitted,
};

let invariantHandlers = {
    get(target, key) {
        invariant(key, 'get');
        // Begin by just doing the default behavior
        let result = Reflect.get(target, key);

        // Make sure not to return a mutable object!
        if(result === Object(result)) return readOnlyView(result);

        // result is a primative, so already immutable
        return result;
    },
    has(target, key) {
        if('_' === key[0]) return false;
        return key in target;
    },
    ownKeys(target) {
        return Reflect.ownKeys(target).filter(key => '_' !== key[0]);
    }
};

module.exports = (spec, tagsAsFolders = true) => {
    //Compose Swagger Spec Handlers
    let proxySwaggerHandlers = Object.assign({}, readOnlyHandlers, invariantHandlers);
    // Create a proxy of the spec (later fix this in swaggman to actually store the spec as a proxy and pass it into here as such)
    let pSwagger    = new Proxy(spec, proxySwaggerHandlers);
    // Folder Reference
    let outputMap = new Map();
    // Output
    let generatedItems = []; // Both folders and items are arrays

    if(pSwagger) {
        // Ensure we have the required properties in the Swagger Spec
        for(const [index, element] of requiredSwaggerProps.entries()) {
            if(!(element in pSwagger)) throw new Error(`Missing reqquired Swagger Spec property "${element}"`);
        }

        // Implement folder structure, honoring exclusion list
        if(tagsAsFolders) {
            // Sanity check
            if(!('tags' in pSwagger)) throw new Error('SwaggerSpec.tags property is required if tagsAsFolders is true');

            // Build Folders
            pSwagger.tags.forEach((tag, idx, arr) => {
                if(!excludeTags.includes(tag.name)) {
                    outputMap.set(tag.name, Object.assign({item: []}, tag));
                }
            });
        }

        // Iterate each path (map.keys()) and generate Postman Item
        let pathsMap = new Map(entries(pSwagger.paths));
        for(let [path, operations] of pathsMap) {
            //console.log('Operations: ', operations);
            for(let method in new Proxy(operations, {})) {
                let requestConfig = {
                    url: path,
                    method: method,
                    header: Object.assign(operations['consumes'], operations['produces']),
                    body: operations['params']
                };
                //console.log('Method: ', method);
                let item = {};
                item['id']          = operations[method]['operationId'];
                item['name']        = operations[method]['summary'];
                //item['request']     = requests(requestConfig);
                //item['event']       = events(path);
                //item['response']    = responses(path);
                //console.log('ITEM: ', item);
            }
        }

        /*
        pathsMap.forEach((method, path, map) => {
            //console.log('method: ', method);
            //console.log('path: ', path);
            console.log('folderSet.has[method]: ', folderSet.has[method.tags]);
            if(this.folderSet.get(method[tags][0])) {
                // This item has an associated folder
                console.log('TRUE');
            }
            // Try to match tags to folder.item respectively
        }, this);

        for(const path of pathsMap.keys()) {
            console.log('spec.paths[P]: ', spec.paths[path]);
            let methodMap = new Map(entries(pathsMap.get(path)));
            console.log('methodMap: ', methodMap);
            for(const methodProps of methodMap) {
                //console.log('methodProps: ', methodProps);
                let item = {};
                //item['id']          = path['operationId'];
                //item['name']        = path['summary'];
                //item['event']     = events(path);
                //item['request']   = requests(path);
                //item['response']  = responses(path);
                //console.log('Item: ', item);
            }
        }
            */

        return generatedItems;
    }
};
