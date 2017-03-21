'use strict';

// Dependencies
const path = require('path');
const helpers = require('../../helpers');
const variables = require('./variables'); // TODO: In the future, might be able to do this better using composition...?
const validProtocolValues = ['http', 'https', 'ws', 'wss']; 

// Used to parse properties according to configured environment variables
const parser = (key, val, expanded = false) => {
    if(!expanded) return String(val); // Support the string brief values by default

    // The following URL properties can be expanded
    if('domain' === key)    return val.split('.');
    if('path' === key)      return val.split(path.sep); // Platform-specific
    if('variables' === key) return variables(val); // Leverages SwaggMan.translator.variables module
    if('query' === key)     return [{key: val[0], value: val[1], description: val[2]}]; // TODO: Map this to params with query filter, or create new dedicated parser for this if needed
};

// Used to invalidate the inputs against know Postman.URL Schema
const invalidate = (...args) => {
    if(!process.env.EXPAND_PROPS) return args[0]; // Should be a string

    const validKeys = new Set(['protocol', 'domain', 'path', 'port', 'query', 'hash', 'variable']);

    if(0 !== args.length) {
        let tmp = {};
        for(const arg of args) {
            if(validKeys.has(arg)) tmp[arg] = parser(arg, args[arg], process.env.EXPAND_PROPS);
        }
        return tmp;
    }
};

/**
  * SwaggMan.translator.urls
  * Invalidates inputs and generates a valid Postman.URL object
  *
  * @param {string|object} input - A URL as a string or an object from Swagger Spec
  * @return {string|object} - If input is only a string, return invalidated string, else return invalidated Postman.URL object
 */
module.exports = (input) => {
    input = invalidate(input);

    return input;
};
