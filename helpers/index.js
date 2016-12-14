module.exports = {
    prerequest: {
        '/oauth/token': 'headerAuthorizationBasic',
        '/oauth/revoke': 'headerAuthorizationBasic'
    },
    test: {
        '/oauth/token': 'handleTokenResponse'
    }
};
