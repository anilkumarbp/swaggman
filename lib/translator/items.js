'use strict';

// Dependencies
const uuid = require('node-uuid');
const events = require('./events');
const requests = require('./requests');

// Vars
const findByAttr = (array, attr, value) => {
    for(let i = 0; i < array.length; i++) {
        if(array[i].name.match(attr)) return i;
    }
    return -1;
};

// Create map from object
function* entries(obj) {
    for( let key in obj) 
        yield [key, obj[key]];
};

module.exports = (spec, tagsAsFolders = true) => {
    // Make sure supplied params are valid
    if(spec && 'object' !== typeof spec && (!spec.swagger || !spec.info || !spec.paths)) throw new Error('Invalid argument type, `spec` must be valid Swagger Spec with required properties');
    if(tagsAsFolders && !spec.tags) throw new Error('SwaggerSpec.tags property is required if tagsAsFolders is true');

    let validPostmanMethods = ['get', 'put', 'post', 'patch', 'delete', 'copy', 'head', 'options', 'link', 'unlink', 'purge', 'lock', 'unlock', 'propfind', 'view'];
    let result = []; // Both folders and items are arrays

    let pathsMap = new Map(entries(spec.paths));

    // Destructuring

    // This maps out Postman.Item objects as Folders appropriately
    if(tagsAsFolders) {
        let folderMap = new Map();
        for(let tag of spec.tags) {
            // TODO: Improve this at a later time to allow excluding particular parameters from environment variables rather than hard-coding
            if(tag.name !== 'OAuth2') {
                let fStub = {};
                if(tag['name'])         fStub['name'] = tag['name'];
                if(tag['item'])         fStub['item'] = [];
                if(tag['auth'])         fStub['auth'] = {};
                if(tag['description'] && '' !== tag['description'])  fStub['description'] = tag['description'];
                folderMap.set(tag.name, fStub);
            }
        }
    }

    // For each path in paths
    pathsMap.forEach((item, route, spec) => {
        let routeMethods = Object.keys(item);
        let parametersMap = new Map(item.parameters);
        let responsesMap = new Map(item.responses);
        //console.log(pathMethods.keys());
        //console.log('path: ', path);
        //console.log('route: ', route);
    });

    return result;
};
