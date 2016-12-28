'use strict';

/**
  * Translator.Items Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const items = require('../../lib/translator/items');
function* entries(obj) {
    for( let key in obj) 
        yield [key, obj[key]];
};

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
// Swagger.ExternalDocsObjectSchema     --> description: str, url: str
// Swagger.ReferenceObjectSchema        --> {$ref: str} ====> http://swagger.io/specification/#referenceObject
// Swagger.ParameterObjectSchema        --> name: str, in: str, description: str, required: {{Boolean}} =====> http://swagger.io/specification/#parameterObject
// Swagger.TagSchema                    --> name: str, description: str, externalDocs: {description: str, url: str}
// Swagger.OperationObjectSchema        --> tags: str, summary: str, description: str, externalDocs: {{ExternalDocsObject}}, operationId: str, consumes: [str], produces: [str], parameters: {{ParameterObject||ReferenceObject}}, responses: {{ResponsesObject}}, schemes: [str], deprecated: {{Boolean}}, security: [{{SecurityRequirementObject}}] ========> http://swagger.io/specification/#operationObject
// Swagger.SecurityObjectSchema         --> {Security Definition Name}: [EMPTY || scopename, scopename...]} =====> http://swagger.io/specification/#securityRequirementObject
// Swagger.ResponsesObjectSchema        --> =====> http://swagger.io/specification/#responsesObject
// Produces||Consumes-AcceptedMimeTypes --> =====> http://swagger.io/specification/#mimeTypes
// Swagger.PathItemObjectSchema         --> $ref: str{PathItemObj}, get|put|post|delete|options|head|patch: {{OperationObject}}, parameters: {{ParameterObject|ReferenceObject}} =====> http://swagger.io/specification/#pathsObject
/* Swagger.operationsObjectStub = {
    tags: [], // Logical grouping of operations by resources or any other qualifier
    summary: 'summaryString', // Preferably < 120 characters
    description: 'descriptionString', // Can be Github Flavored Markdown
    externalDocs: {},
    operationId: 'operationIdString', // Must be unique (this may be used by other tools and libraries)
    consumes: ['application/json'], // Must be one of AcceptedMimeTypes (or empty array to override global for API spec)
    produces: ['application/json'], // Must be one of AcceptedMimeTypes (or empty array to override global for API spec)
    parameters: [{{ParameterObject}}||{{ReferenceObject}}], // Unique parameter is defined by a combination of `name` and `location`
    responses: {200: {description: 'requiredDescription', schema: {$ref: '#/definitions/requiredDescriptionResponseDef'}, headers: [headersObj], examples: {exampleObj}}, default: {description: 'unexpectedError', schema: {$ref: '#/definitions/ErrorModel'}}}, // Default can be used for all HTTP codes not covered individually, must contain at least one response code (should be for a successful operation call). Maps httpStatusCode => responseObj !!! Can be $ref object pointing to definition on Swagger Object's responses section (http://swagger.io/specification/#swaggerResponses). SchemaObject can use type=file if mime-type is set respectively
    schemes: ['https'], // One of: https, http, ws, wss
    deprecated: false, // Boolean, defaults to false
    security: [{}] // At Item level, this overrides any top-level Security (to remove top-level security declaration, use empty array. Must be a Security Requirement Object, each name on each object must correlate directly to a security scheme declared in the {{Security Definitions}} for the Swagger API Spec. If the security scheme is of type "oauth2", then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.
};
*/
const postmanItemSchema = {
    id: 'itemId',
    name: 'itemName', // Maps to Swagger.TagSchema.name
    event: [{}],
    request: {},
    response: [{}]
};
const postmanFolderSchema = {
    name: 'folderName', // Maps to Swagger.TagSchema.tag[ITEM.name]
    description: 'folderDescription', // Maps to Swagger.TagSchema.tag[ITEM.description]
    item: [{}], // Duck-type to postmanItemSchema
    auth: {} // If not provided, should use global auth
};

test('Translator.items()', (t) => {
    t.equal(typeof items, 'function', 'translator.items is a function');
    t.throws(() => { items('shouldFail') }, /Invalid argument type, `spec` must be valid Swagger Spec with required properties/, 'translator.items() requires `spec` parameter to be an SwaggerSpec');
    t.throws(() => { items({swagger: '', info: '', paths: ''}, true) }, /SwaggerSpec.tags property is required if tagsAsFolders is true/, '`TAGS_AS_FOLDERS` requires SwaggerSpec.tags property');
    t.doesNotThrow(() => { items(swaggerStub) }, null, 'Passed valid `spec` and TAGS_AS_FOLDERS as true, does now throw error');
    t.doesNotThrow(() => { items(swaggerStub) }, null, 'Passed only valid `spec`, does not throw an error');
        /*
        path.forEach((tag) => {
            let fStub = {};
            if(tag['name'])         fStub['name'] = tag['name'];
            if(tag['item'])         fStub['item'] = [];
            if(tag['auth'])         fStub['auth'] = {};
            if(tag['description'])  fStub['description'] = tag['description'];
            dummyFolders.push(fStub);
        });
        */
    /*
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.ok(Array.isArray(testItems), 'Item must be type array');
    //t.equal(testItems[0].hasOwnProperty('request'), true, 'Items require `request` property');
    //t.equal(typeof testItems[0].'item'], 'object', 'Required `request` property must be an object');
    */
    t.end();
});
