'use strict';

// Dependencies
const definitions = require('./definitions');

// Params Module
module.exports = (swaggerJSON, paramFilter, path, verb) => {
    let filterMap = {
        query: [],
        header: [],
        body: {}
    };

    let output = filterMap[paramFilter];
    
    let defaultHeaders = {
        all: {
            acceptsHeader: {
                key: 'Accepts',
                value: 'application/json'
            }
        },
        auth: {
            contentTypeHeader: {
                key: 'Content-Type',
                value: 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            authorizationHeader: {
                key: 'Authorization',
                value: 'Basic: {{basicAuthHeaderValue}}'
            }
        },
        nonAuth: {
            contentTypeHeader: {
                key: 'Content-Type',
                value: 'application/json'
            },
            authorizationHeader: {
                key: 'Authorization',
                value: 'Bearer: {{myAccessToken}}'
            }
        }
    };

    // Set flags
    let ContentType = null;
    let Authorization = null;
    let Accept = null;

    for(let parameter of swaggerJSON.paths[path][verb].parameters) {
        if(parameter['in'] === paramFilter && parameter['required']) {
            switch(paramFilter) {
                case 'path':
                    //console.log('PATH: ', parameter['name']);
                    // These are ALWAYS requiired, TODO: DETERMINE HOW TO HANDLE BEST, impove logic to read from environment variables or template scripts
                    let v = (parameter['default']) ? parameter['default'] : '{{' + parameter['name'] + '}}';
                    output.push({
                        key: parameter['name'],
                        value: v
                    });
                break;

                case 'query':
                    //console.log('QUERY: ', parameter['name']);
                    // Possible types are: string, integer, array (which is just the enum[] vals comma separated)
                    output.push({
                        key: parameter['name'],
                        value: '',
                        description: parameter.description
                    });
                break;

                // Content-Type: application/json
                case 'body':
                    //console.log('BODY: ', parameter['name']);
                    // These are not ALWAYS required, TODO: DETERMINE HOW TO HANDLE BEST
                    let mode = ( path.match(/oauth/) ) ? 'raw' : 'urlencoded';
                    output.mode = mode;
                    if(-1 !== path.indexOf('fax')) {
                        output.raw = definitions(swaggerJSON, parameter.schema['$ref']);
                    } else {
                        output.urlencoded = definitions(swaggerJSON, parameter.schema['$ref']);
                    }
                break;

                // Content-Type: x-www-form-urlencoded
                case 'formData':
                    //console.log('FORM DATA: ', parameter['name']);
                break;

                case 'header':
                    //console.log('HEADER: ', parameter['name']);
                    if('Content-Type' === parameter['name']) ContentType = true;
                    if('Authorization' === parameter['name']) Authorization = true;
                    if('Accept' === parameter['name']) Accept = true;
                    output.push({
                        key: parameter['name'],
                        value: parameter['default']
                    });
                break;

                default:
                    console.error('Translator.params error for: ', path + ': ' + verb);
            }
        }
    }

    // Include the defaults if they're not present
    if(path.match(/oauth/) && 'header' === paramFilter) {
        if(!ContentType) output.push(defaultHeaders.auth.contentTypeHeader);
        if(!Authorization) output.push(defaultHeaders.auth.authorizationHeader);
    }
    if(!path.match(/oauth/) && 'header' === paramFilter) {
        if(!ContentType) output.push(defaultHeaders.nonAuth.contentTypeHeader);
        if(!Authorization) output.push(defaultHeaders.nonAuth.authorizationHeader);
    }
    if(!Accept && 'header' === paramFilter) output.push(defaultHeaders.all.acceptsHeader);

    return output;
};
