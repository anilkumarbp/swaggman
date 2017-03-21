'use strict';

module.exports = {
    'post': {
        header: [
            { 'Authorization': 'Basic: ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64') },
            { 'Content-Type': 'x-www-form-urlencoded' },
            { 'Accept': 'application/json' }
        ],
        body: {
        }
    }
};
