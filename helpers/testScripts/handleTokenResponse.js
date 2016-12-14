module.exports = {
    name: 'handleTokenResponse',
    id: 'handleTokenResponse',
    exec: [
        "tests[\"Status code is 200\"] = responseCode.code === 200;",
        "var jsonData = JSON.parse(responseBody);",
        "tests[\"Contains an access token\"] = jsonData.hasOwnProperty('access_token');",
        "tests[\"Contains an owner_id\"] = jsonData.hasOwnProperty('owner_id');",
        "postman.setEnvironmentVariable('myAccessToken', jsonData.access_token);",
        "postman.setEnvironmentVariable('accountId', jsonData.owner_id);"
    ],
    type: "text/javascript"
};
