'use strict';

// Dependencies

// Swagger to Postman Translator
const translator = {
    info:       require('./info'),
    items:      require('./items'),
    events:     require('./events'),
    params:     require('./params'),
    variables:  require('./variables'),
    auth:       require('./auth')
};

module.exports = translator;
