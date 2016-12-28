'use strict';

// Dependencies
const helpers = require('../../helpers');
// TODO: Need to refactor this to handle file pathing better

module.exports = (path, method) => {
    let events = [];

    if(!path) throw new Error('Requires at least one argument, either `globals` or path');

    if('globals' === path && helpers.globals) {
        // Sanity check
        if(!helpers.hasOwnProperty('globals')) throw new Error('Missing `globals` property on helpers for events');

        if(helpers.globals.test) {
            let test = helpers.globals.test;
            test.listen = 'test';
            events.push(test);
        }
        if(helpers.globals.prerequest) {
            let prerequest = helpers.globals.prerequest;
            prerequest.listen = 'prerequest';
            events.push(prerequest);
        }
    } else {
        // Handle invalid argument type
        if('string' !== typeof path) throw new Error('Invalid argument type supplied for `path` to translator.events()');
        if(!helpers.hasOwnProperty(path)) throw new Error('Unknown path supplied to translator.events()');
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
    }

    return events;
};
