module.exports = {
    script: "var appKey = postman.getEnvironmentVariable(\"appKey\");var appSecret = postman.getEnvironmentVariable(\"appSecret\");postman.setEnvironmentVariable(\"basicAuthHeaderValue\", encodeBasicAuthHeader());function encodeBasicAuthHeader() {var apiKey = appKey + ':' + appSecret;if(btoa) {return btoa(apiKey);} else {}}",
    type: "text/javascript"
};
