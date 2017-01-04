'use strict';

/**
  * Translator.Params Test Spec
**/

// Dependencies
//const postmanSchema = require('./postmanCollectionSchema.json'); // Used for internal invalidation testing
const test = require('tape');
const params = require('../../lib/translator/params');

// Stubs
const swaggerStub = require('../RCSwagger_20161116.json');
const acceptedInValues = ['query', 'header', 'path', 'formData', 'body'];

// Parameter Array Item Stubs
const validParamArr = [
    {'name': 'someParamName', 'in': 'header'}
];
const invalidParamArr = ['invalid'];

// Argument Stubs
const validArgumentStub = {
    route: '/v1.0/account/{accountId}/extension',
    parameters: validParamArr
};
const missingRouteStub = {
    parameters: [{'name': 'someParamName', 'in': 'header'}]
};
const missingParametersStub = {
    route: '/v1.0/account/{accountId}/extension'
};

/* Logical Requirements based on Swagger Spec
 *
 * If arg['in'] === path, arg['name'] must exist in path templating
 * If arg['in'] === path, `required` property is required and must be `true`
 * If arg['in'] === body, `schema` as SwaggerSpec.Schema Object is required to define the body type
 * If arg['in'] !== body, `type` property is required, and must be one of ['string', 'number', 'integer', 'boolean', 'array', or 'file'].
 * If arg['type'] === file, `consumes` MUST be one of ['multipart/form-data', 'application/x-www-form-urlencoded'] -OR- both and parameter must be `in` 'formData'
 * If arg['type'] === array, `items` property is required to describe the type of items in the array
 * `allowEmptyValue` {boolean} may be set to `true` only if arg['in'] === query || arg['in'] === formData (defaults false)
 * If arg['default'] isset, must not cause type mismatch with arg['type']
 * If arg['in'] === body, `schema` property may be set to a $ref value which corresponds to SwaggerSpec.definitions
*/

test('Translator.params()', (t) => {
    t.equal(typeof params, 'function', 'Should be a function');
    t.doesNotThrow(() => {params(validArgumentStub)}, null, 'Accepts configuration object with expected properties');
    t.doesNotThrow(() => {params({route: '/v1.0/account/{accountId}/extension', parameters: []})}, null, 'Accepts configuration where `parameters` is an empty array');
    t.throws(() => {params()}, /TypeError: Cannot match against 'undefined' or 'null'./, 'Throws if config object is missing');
    t.throws(() => {params(missingRouteStub)}, /Missing required config property: route/, 'Throws if `route` property is missing from config argument object');
    t.throws(() => {params(missingParametersStub)}, /Missing required config property: parameters/, 'Throws if `parameters` property is missing from config argument object');
    t.throws(() => {params({route: '/v1.0/some/path', parameters: invalidParamArr})}, /Each parameter in parameterArray must be of type `object`/, 'Throws if `parameters` element is not type object');
    t.throws(() => {params({route: '/v1.0/some/path', parameters: [{name: 'someParamName'}]})}, /Missing required parameter property `in`/, 'Throws if `parameters` array elements do not contiain required properties: in');
    /*
    t.equal(typeof requests(expandedRequestStub), 'object', 'Accepts object as input');
    t.looseEqual(requests(expandedRequestStub), expandedRequestStub, 'Returns valid Postman Request object from expanded argument properties');
    t.deepEqual(requests(briefRequestStub), briefRequestStub, 'Returns valid Postman Request object from brief argument properties');
    t.fail('TODO: Complete');
    let testFolders = translate.folders(swaggerStub);
    let testItems = translate.items(swaggerStub, testFolders);
    t.comment('TODO: Need to improve this quite a bit');
    */
    t.end();
});
