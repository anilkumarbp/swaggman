'use strict';

// Dependencies
const uuid = require('node-uuid');

module.exports = (swaggerJSON, ...options) => {
    // Throw if required parameter is missing
    if(!swaggerJSON) throw new Error('Missing required argument `swaggerJSON` on translator.info()');
    // Postman requires info to have properties: name and schema, see: https://schema.getpostman.com/json/collection/v2.0.0/docs/index.html
    if('object' !== typeof swaggerJSON) {
        throw new Error('Invalid argument type, requires object');
    } else {
        if(!swaggerJSON['info']) throw new Error('Missing property `info` on object supplied as argument to translator.info()');
        if(!swaggerJSON.info.hasOwnProperty('name') && !process.env.POSTMAN_NAME) throw new Error('Missing property `name` on info object supplied as argument to translator.info()');
        if(!swaggerJSON.info.hasOwnProperty('schema') && !process.env.POSTMAN_SCHEMA) swaggerJSON.info.schema = 'https://schema.getpostman.com/collection/v2'; // This correlates specifically to the state of SwaggMan, use it as the default
    }

    let postmanInfo = {};

    // Use environment variables over supplied data if they are set
    let postmanName = process.env.POSTMAN_NAME || swaggerJSON.info['name'];
    let postmanSchema = process.env.POSTMAN_SCHEMA || swaggerJSON.info['schema'];
    let postmanDescription = process.env.POSTMAN_DESCRIPTION || swaggerJSON.info['description'];
    if(postmanDescription && 'string' === typeof postmanDescription && swaggerJSON.info.termsOfService) {
        postmanDescription += '\n\n';
        postmanDescription += swaggerJSON.info.termsOfService;
    }
    if(postmanDescription && 'string' === typeof postmanDescription && swaggerJSON.info.contact) {
        postmanDescription += '\n\n';
        postmanDescription += swaggerJSON.info.contact;
    }
    if(postmanDescription && 'string' === typeof postmanDescription && swaggerJSON.info.license) {
        postmanDescription += '\n\n';
        postmanDescription += swaggerJSON.info.license;
    }
    let postmanVersion = process.env.POSTMAN_VERSION || swaggerJSON.info['version'];
    let postmanId = process.env.POSTMAN_ID || uuid.v4();

    // Required properties for Postman.info
    postmanInfo['name']         = postmanName;
    postmanInfo['schema']       = postmanSchema;
    postmanInfo['description']  = postmanDescription;
    postmanInfo['version']      = postmanVersion;
    postmanInfo['_postman_id']  = postmanId;

    return postmanInfo;
};
