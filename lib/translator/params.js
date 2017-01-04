'use strict';

// Dependencies
const definitions = require('./definitions');

/**
  * reqParam
  * Enforce parameters which must be supplied using destructuring
  *
  * @param {string} value - The expected parameter
 */
const reqParam = (value) => {
    throw new Error(`Missing required config property: ${value}`);
};

/**
  * invalidateParams
  * Enforce arguments adhere to requirements
  *
  * @param {object} parameterArray - Element as object from parameters array
  * @return {error||true} - If any of the array's elements are invalid, throw an error, else return true
**/
const invalidateParameters = (parameterArray) => {
    const acceptedInValues = ['query', 'header', 'path', 'formData', 'body'];
    if(!Array.isArray(parameterArray)) throw new Error('Type mismatch, `parameters` must be an array');
    if(0 < parameterArray.length) {
        for(var param of parameterArray) {
            if('object' !== typeof param) throw new Error('Each parameter in parameterArray must be of type `object`');
            if(!param.hasOwnProperty('name')) throw new Error('Missing required parameter property `name`');
            if(!param.hasOwnProperty('in')) throw new Error('Missing required parameter property `in`');
            if('string' !== typeof param['name']) throw new Error('Parameter property `name`, must be type string');
            if('string' !== typeof param['in']) throw new Error('Parameter property `in`, must be type string');
            if(-1 === acceptedInValues.indexOf(param['in'])) throw new Error('Invalid parameter property `in`, must be one of: query, header, formData, body');
        }
    }
    return true;
};

/**
  * Swaggman.translator.params Module
  * Converts Swagger 2 Spec Parameters to valid Postman 2 Collection Params
  *
  * @param {object} config - Parameters configuration object with `route` and `parameters` at a minimum
  * @return {postmanRequestObj} - Postman Request object associated with the arguments
**/
module.exports = ({route = reqParam('route'), parameters = reqParam('parameters')}) => {
    if(0 !== parameters.length) invalidateParameters(parameters);
    let postmanRequestObj = {}; // Should have: url, method, header, [body], 

/* Logical Requirements based on Swagger Spec
 *
 * If arg['in'] === path, arg['name'] must exist in path templating
 * If arg['in'] === path, `required` property is required and must be `true`
 * If arg['in'] === body, `schema` as SwaggerSpec.Schema Object is required to define the body type
 * If arg['in'] !== body, `type` property is required, and must be one of ['string', 'number', 'integer', 'boolean', 'array', or 'file'].
 * If arg['type'] === file, `consumes` MUST be one of ['multipart/form-data', 'application/x-www-form-urlencoded'] -OR- both and parameter must be `in` 'formData'
 * If arg['type'] === array, `items` property is required to describe the type of items in the array
 * `allowEmptyValue` {boolean} may be set to `true` only if arg['in'] === query || arg['in'] === formData (defaults false)
 * If arg['default'] isset, must not cause type mismatch with arg['type']
 * If arg['in'] === body, `schema` property may be set to a $ref value which corresponds to SwaggerSpec.definitions
*/


    return postmanRequestObj;
};

// Params Module
/*
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
*/
