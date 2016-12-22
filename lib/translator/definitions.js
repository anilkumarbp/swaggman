'use strict';

let convertEnumToString = (property) => {
    let result = '';
    for(let val of property.type['enum']) {
        result += (val !== property.type['enum'][0])
            ? '|' + val
            : val
            ;
    }
    return result;
};

let definitionParser = (swaggerJSON, ref) => {
    let parsedResult = {};
    ref = ref.split('/')[2];
    if(!ref) throw new Error('Missing parameter `ref` in definitionParser'); 
    let definitionList = swaggerJSON.definitions;
    let definition = swaggerJSON.definitions[ref];

    if(definition.required) {
        for(let x = 0; x < definition.required.length; x++) {
            parsedResult[definition.required[x]] = null;
        }
    } else {
        for(let x = 0; x < definition.properties.length; x++) {
            parsedResult[p] = convertEnumToString(p);
        }
    }

    for(let prop in parsedResult) {
        //console.log('prop: ', prop);
        //console.log('definition.properties[prop]: ', definition.properties['prop']);
        if(definition.properties[prop] === ['$ref']) {
            parsedResult[prop] = definitionParser(swaggerJSON, prop['$ref']);
        } else {
            let p = definition.properties[prop];
            switch(p.type) {
                case 'string':
                    // Display each possible type of value that can be used
                    if(p.type['enum']) {
                        parsedResult[prop] = convertEnumToString(prop);
                    } else {
                        parsedResult[prop] = ''; 
                    }
                break;

                case 'array':
                    parsedResult[prop] = [];
                    // TODO: Need to complete
                break;

                case 'integer':
                    if('page') parsedResult[prop] = process.env.PAGE_DEFAULT;
                    if('perPage') parsedResult[prop] = process.env.PERPAGE_DEFAULT;
                    // TODO: Improve by allowing other defaults to be set
                break;

                case 'boolean':
                    // TODO: Improve by allowing other defaults to be set
                    parsedResult[prop] = true; // Default to true
                break;

                default:

            }
        }
    }

    return parsedResult;
};

module.exports = definitionParser;
