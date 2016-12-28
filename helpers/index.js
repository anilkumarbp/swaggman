module.exports = {
    // Global is for top-level Postman.Events
    globals: {
        test: {
            //script: `string` || `scriptObject`,
            script: "some test javascript"
            //disabled: true || false (default)
        },
        prerequest: {
            //script: `string` || `scriptObject`,
            script: "some prerequest javascript",
            //disabled: true || false
            disabled: true
        }
    },
    auth: {
        '/oauth/token': 'tokens',
        '/v1.0/account/{accountId}/extension/{extensionId}': 'extensions'
    },
    prerequest: {
        '/oauth/token': 'headerAuthorizationBasic',
        '/oauth/revoke': 'headerAuthorizationBasic'
    },
    test: {
        '/oauth/token': 'handleTokenResponse'
    }
};
