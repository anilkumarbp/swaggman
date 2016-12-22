'use strict';

// Dependencies
/*
const Validator = require('jsonschema').Validator;
const v = new Validator();
*/

// TODO: !!! CRITICAL ---> Add Postman2 Schema Definitions to Validator

// Swagger to Postman Translator
const translator = {
    auth:       require('./auth'),
    events:     require('./events'),
    folders:    require('./folders'),
    info:       require('./info'),
    items:      require('./items'),
    params:     require('./params'),
    requests:   require('./requests'),
    urls:       require('./urls'),
    variables:  require('./variables')
};

module.exports = translator;
