'use strict';

// Dependencies
const urls      = require('./urls');
const params    = require('./params');

module.exports = (swaggerJSON, path, verb) => {
    // NOTE: Can be string or object, using object, may choose to change in the future
    //console.log('requests.path: ', path);
    //console.log('requests.verb: ', verb);
    let requestObj = {};
    requestObj.url      = urls(swaggerJSON, path, verb);
    requestObj.auth     = path['auth'];
    requestObj.method   = verb;
    requestObj.header   = params(swaggerJSON, 'header', path, verb);
    requestObj.body     = params(swaggerJSON, 'body', path, verb); 

    return requestObj;
};
