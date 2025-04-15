var { defineConfig } = require("eslint/config");
var js = require("@eslint/js");
var globals = require("globals");

module.exports = defineConfig([{
  "files": ["catmagick_server.js"],
  "plugins": { js },
  "extends": ["js/recommended"],
  "languageOptions": {
    "sourceType": "commonjs",
    "globals": {
      ...globals.node
    }
  }
}, {
  "files": ["catmagick_client.js"],
  "plugins": { js },
  "extends": ["js/recommended"],
  "languageOptions": {
    "sourceType": "script",
    "globals": {
      ...globals.browser,
      "pako": "readonly"
    }
  }
}]);
