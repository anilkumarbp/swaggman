'use strict';

/**
  * Swagger Loader
  *
  * Author: Benjamin M. Dean
  * Description: Simple tool to load a Swagger Specification file from local disk or URI
  * Created: December 2016
**/

// Deps

const readLocalFile = (file) => {
    return new Promise((resolve, reject) => {
        require('fs').readFile(file, (err, data) => {
            if(err) {
                console.error(err);
                reject(err);
            } else {
                //console.log('Swagger Spec file loaded.');
                resolve(data);
            }
        });
    });
};

const readHttpFile = (uri) => {
    return new Promise((resolve, reject) => {
        if(!uri || '' === uri) reject(new Error('Missing argument `uri`'));
        const lib = uri.startsWith('https') ? require('https') : require('http');
        const request = lib.get(uri, (response) => {
            // Handle HTTP errors
            if(response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load URL, status code: ${response.statusCode}'));
            }
            // Placeholder for chunked response
            const body = [];
            response.on('data', (chunk) => {
                body.push(chunk);
            });
            response.on('end', () => {
                //console.log('Swagger Spec file downloaded.');
                //console.log('typeof readHttpFile data: ', typeof body.join(''));
                resolve(body.join(''));
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports.load = (spec) => {
    if(!spec || 'string' !== typeof spec) throw new Error('Swagger specification file or URI is required');
    //console.log('SPEC: ', spec);
    if(spec.startsWith('http://', 1) || spec.startsWith('https://')) {
        // Load from  web server
        readHttpFile(spec)
        .then(function(json) {
            //console.log('URI data: ', json);
            //console.log('Typeof URI data: ', typeof json);
            return JSON.parse(json);
        })
        .catch(function(e) {
            console.error(e);
            throw e;
        });
    } else {
        // Load from local file system
        readLocalFile(spec)
        .then(function(parsedJSON) {
            //console.log('readLocalFile data: ', parsedJSON);
            //console.log('typeof readLocalFile data: ', typeof parsedJSON);
            return parsedJSON;
        })
        .catch(function(e) {
            console.error(e);
            throw e;
        });
    }
};
