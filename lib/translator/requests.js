'use strict';

// Dependencies
const auth      = require('./auth');
const urls      = require('./urls');
const params    = require('./params');

// Utility
const objToLib = (obj) => {
    let arr = [];
    for( let k in val ) {
        let newObj = {};
        arr.push(newObj[k] = val[k]);
    }
    return arr;
};

// Parses inputs
const parser = (key, val, expanded = false) => {
    if(!expanded) return String(val); // Support the string brief values by default

    // The following URL properties can be expanded
    if('url' === key)       return urls(val);
    if('auth' === key)      return auth(val);
    if('method' === key)    return String(val);
    // TODO: Header could be: [{key: 'key', value: 'value}, ...], or it could be {"key": value, ...}
    if('header' === key)    return (Array.isArray(val)) ? val : objToLib(val);
    if('body' === key)      return [{key: val[0], value: val[1], description: val[2]}]; // TODO: Map this to params with query filter, or create new dedicated parser for this if needed
};

// Invalidates inputs
const invalidate = (...args) => {
    if(!process.env.EXPAND_PROPS) return args[0]; // Should be a string

    const validKeys = new Set(['url', 'auth', 'method', 'header', 'body']);

    if(0 !== args.length) {
        let tmp = {};
        for(const arg of args) {
            if(validKeys.has(arg)) tmp[arg] = parser(arg, args[arg], process.env.EXPAND_PROPS);
        }
        return tmp;
    }
};

/**
  * Swaggman.translator.requests
  * Translates Swagger to Postman Request objects
  *
  * @param {string|object} input - Accepts a string or an object
  * @return {string|object) - If the environment variable `EXPAND_PROPS` is set to true, returns object, else returns string
 */
module.exports = (input) => {

    input = invalidate(input);

    return input;
};
