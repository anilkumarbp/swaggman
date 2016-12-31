'use strict';

// Build variable as Map from arguments
const invalidate = ({id, value, type, name}) => {
    let valid = {};

    // TODO: Invalidation

    // TODO: Invalid...? Throw!

    // Assign invalidated values
    valid['id']     = id;
    valid['value']  = value;
    valid['type']   = type;
    valid['name']   = name;
    
    return valid;
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

    //console.log('vars: ', vars);
    return vars;
};
