'use strict';

// Build variable as Map from arguments
const invalidate = (...args) => {
    const validKeys = new Set(['id', 'value', 'type', 'name']);
    let validObj = null;

    // If we were provided args and they are valid, build the variable object, otherwise return null
    if(0 !== args.length) {
        let tmp = {};
        for(const arg of args) {
            if(validKeys.has(arg)) tmp[arg] = args[arg];
        }
    }
    
    // Can be a null value for variable if no args provided
    return validObj = tmp;
};

/**
  * SwaggMan.translator.variables
  * Used to generate a list of variables from a set of objects.
  * Example, from Swagger.paths.route.method.parameters (of type `path`) => Postman.items.request.url.variables
  *
  * @param {object} opts - The parameters required to build the variable
  * @return {array} vars - A hash of the variable objects translated from Swagger
 */
module.exports = (...hash) => {
    let vars = [];

    hash = Array.from(hash);
    for(const item of hash) {
        vars.push(invalidate(item));
    }

    return vars;
};
