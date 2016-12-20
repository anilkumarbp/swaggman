'use strict';

/**
  * Asset Loader
  *
  * Author: Benjamin M. Dean
  * Description: Simple tool to load a local or remote assets
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

module.exports.load = (asset) => {
    if(!asset|| 'string' !== typeof asset) throw new Error('Asset file or URI is required');
    //console.log('ASSET: ', asset);
    if(asset.startsWith('http://', 1) || asset.startsWith('https://')) {
        // Load from  web server
        readHttpFile(asset)
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
        readLocalFile(asset)
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
