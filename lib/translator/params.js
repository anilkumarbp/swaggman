'use strict';

// Dependencies
const definitions = require('./definitions');
const requests = require('./requests');

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
    let postmanRequestObj = {}; // Can have: url, method, header, [body], [description]  ---> Should translate params to Postman.Request object

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
