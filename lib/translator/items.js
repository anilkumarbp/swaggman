'use strict';

// Dependencies
const uuid = require('node-uuid');

// Vars
const findByAttr = (array, attr, value) => {
    for(let i = 0; i < array.length; i++) {
        if(array[i].name.match(attr)) return i;
    }
    return -1;
};

module.exports = (swaggerJSON, folders) => {
    if('object' !== typeof swaggerJSON) throw new Error('Invalid argument, requires swaggerJSON');
    let postmanItems = folders || [];
    if(swaggerJSON) {
        let paths = Object.keys(swaggerJSON.paths); // Swagger.paths[routeName] which is the routeName
        for(let path of paths) {
            // Iterate the verbs for each path
            let verbs = Object.keys(swaggerJSON.paths[path]);
            for(let verb of verbs) {
                // Create new item for each verb within each path
                let item = {};

                // Generate Item
                item.name           = swaggerJSON.paths[path][verb].summary;
                item.id             = swaggerJSON.paths[path][verb].operationId || uuid.v4; // If there is no unique identifier, create one
                item['events']      = []; //generateEventArray(path, verb); // TODO: Fix this to use translator.events
                item['request']     = {}; //generateRequestObject(path, verb); // TODO: Fix this to use translator.requests
                item['responses']   = []; // TODO: Fix this to use translator.responses

                // Map and insert item into proper folder
                if(folders && 0 < folders.length) {
                    postmanItems[findByAttr(folders, swaggerJSON.paths[path][verb].tags[0])].items.push(item);
                } else {
                    postmanItems.push(item);
                }
            }
        }
    }
    return postmanItems;
};
