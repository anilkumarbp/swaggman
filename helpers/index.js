module.exports = {
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
