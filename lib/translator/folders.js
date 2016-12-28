'use strict';

// Variables
const convertTagToFolder = (tag) => {
    //TODO: Need to implement the optional `auth` property on folder object
    let folder = {};
    if(tag.name) folder.name = tag.name;
    if(tag.description) folder.description = tag.description;
    folder.items = [];
    if(tag.auth) folder.auth = tag.auth;

    return folder;
};


module.exports = (folderName, items, description = null, auth = null) => {
    if(!folderName && !items) throw new Error('Missing argument, requires two parameters');
    if(!folderName) throw new Error('Missing argument, requires folderName parameter');
    if('string' !== typeof folderName) throw new Error('Invalid argument type, `folderName` argument must be of type `string`');
    if(!items) throw new Error('Missing argument, requires `items` parameter');
    if(!Array.isArray(items)) throw new Error('Invalid argument type, `items` argument must be of type `array`');
    let folders = []; // Actually is just Postman.item Array

    /*
    let tags = swaggerJSON.tags;
    if(!tags && process.env.IMPLEMENT_TAGS_AS_FOLDERS) {
        throw new Error('generateFolders expects swaggerJSON.tags to be an array and contain elements, or environment variable IMPLEMENT_TAGS_AS_FOLDERS to be set to false');
    } else {
        // Populate Postman Collection with folders
        for(let tag of tags) {
            folders.push(convertTagToFolder(tag));
        }
    }
    */

    return folders;
};
