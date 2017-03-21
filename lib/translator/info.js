'use strict';

// Dependencies
const uuid = require('node-uuid');

/**
  * requiredParam
  * Enforce parameters which must be supplied using destructuring
  *
  * @param {string} value - The expected parameter
  * @param {string} envVal - The property name used to lookup environment variables from process.env
 */
const requiredParam = (value, envVal) => {
    if(process.env[envVal]) {
        return process.env[envVal];
    } else {
        throw new Error(`Missing required config property: ${value}`);
    }
};

/**
  * SwaggMan.info module
  * Converts input from Swagger into valid Postman 2 Info Schema
  *
  * @param {object|string} config - The Swagger.info object, or the Swagger.info.title string
  * @param {ES6 Rest Params} ...opts - [schema, description, version, _postman_id, contact, license, termsOfService, ...extras] from the Swagger.info or Swagger Spec
  * @return {object} - The Postman.info object (concatenating all non-Postman.info schema items with newline separators to description
 */

module.exports = ({
    title:name = requiredParam('title', 'POSTMAN_NAME'),
    schema = 'https://schema.getpostman.com/collection/v2',
    description = '',
    version,
    license,
    contact,
    termsOfService,
    postmanId = uuid.v4()} = {}) => {

    let postmanInfo = {};

    // Required properties for Postman.info
    postmanInfo['name']     = name;
    postmanInfo['schema']   = schema;

    // Optional properties for Postman.info
    if(version) postmanInfo['version']          = version;
    if(postmanId) postmanInfo['_postman_id']    = postmanId;
    if(description) postmanInfo['description']  = description;

    // Bolt on un-mappable properties to description with newline separators
    if(license) postmanInfo['description'] += '\n\n' + license;
    if(contact) postmanInfo['description'] += '\n\n' + contact;
    if(termsOfService) postmanInfo['description'] += '\n\n' + termsOfService;

    return postmanInfo;
};
