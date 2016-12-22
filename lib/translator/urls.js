'use strict';

// Dependencies
const helpers = require('../../helpers');
const params = require('./params');
// TODO: Need to refactor this to handle file pathing better

module.exports = (swaggerJSON, path, verb) => {
    //console.log('urls.path: ', path);
    //console.log('urls.verb: ', verb);
    let url = [];
    if(process.env.API_BASE_URL_ENVIRONMENT_STRING) {
        return process.env.API_BASE_URL_ENVIRONMENT_STRING + path;
    } else {
        // TODO: Need to improve this greatly
        return {
            protocol: '',
            domain: [],
            path: [],
            port: '',
            query: params(swaggerJSON, 'query', path, verb),
            hash: '',
            variables: []
        };
    }
    return url;
};
