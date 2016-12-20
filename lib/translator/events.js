'use strict';

// Dependencies
const helpers = require('../../helpers');
// TODO: Need to refactor this to handle file pathing better

module.exports = (path, verb) => {
    let events = [];

    if(helpers.prerequest.hasOwnProperty(path)) {
        events.push({
            listen: 'prerequest',
            script: require('../../' + process.env.HELPERS_DIR + '/prerequestScripts/' + helpers.prerequest[path])
        });
    }
    if(helpers.test.hasOwnProperty(path)) {
        events.push({
            listen: 'test',
            script: require('../../' + process.env.HELPERS_DIR + '/testScripts/' + helpers.test[path])
        });
    }
    return events;
};
