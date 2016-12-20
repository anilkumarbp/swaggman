'use strict';

// Dependencies
/*
const Validator = require('jsonschema').Validator;
const v = new Validator();
*/

// TODO: !!! CRITICAL ---> Add Postman2 Schema Definitions to Validator

// Swagger to Postman Translator
const translator = {
    info:       require('./info'),
    items:      require('./items'),
    folders:    require('./folders'),
    events:     require('./events'),
    params:     require('./params'),
    variables:  require('./variables'),
    auth:       require('./auth')
};

module.exports = translator;
