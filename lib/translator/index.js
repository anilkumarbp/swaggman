'use strict';

// Dependencies
const items = require('./items'); // Can be folders or items
const events = require('./events');
const queryParams = require('./queryParams');
const headerParams = require('./headerParams');
const bodyParams = require('./bodyParams');

// Swagger to Postman Translator
const translator = {
    info: require('./info'),
    folders: items,
    items: items,
    events: events,
    query: queryParams,
    headers: headerParams,
    body: bodyParams

};

module.exports = translator;
