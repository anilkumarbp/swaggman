'use strict';

// Dependencies
const uuid = require('node-uuid');

module.exports = (swaggerJSON) => {
    //console.log('convertInfo');
    if('object' !== typeof swaggerJSON) throw new Error('Invalid argument, requires swaggerJSON');
    let info = {};
        // Define Postman Info from Environment Variables but default to Swagger properties
        info._postman_id    = process.env.POSTMAN_ID            || uuid.v4();
        //console.log('swaggerJSON.info.version: ', swaggerJSON.info.version);
        info.version        = process.env.API_VERSION           || swaggerJSON.info.version;
        info.name           = process.env.POSTMAN_TITLE         || swaggerJSON.info.title;
        info.schema         = process.env.POSTMAN_SCHEMA_URI    || 'https://schema.getpostman.com/json/collection/v' + process.env.POSTMAN_SCHEMA_SEMVER + '/collection.json';
        info.description    = process.env.POSTMAN_DESCRIPTION   || swaggerJSON.info.description;
        // No place to map in Postman, adding to description 
        if(swaggerJSON.info.termsOfService) info.description    += '\n\n' + swaggerJSON.info.termsOfService;
        if(swaggerJSON.info.contact) info.description           += '\n\n' + swaggerJSON.info.contact;
        if(swaggerJSON.info.license) info.description           += '\n\n' + swaggerJSON.info.license;
    return info;
};
