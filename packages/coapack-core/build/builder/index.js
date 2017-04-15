/**
 * Builder
 * Handles building the app & getting ready for packaging
 * @param config {Object} Config to use
 */
// Functions needed
// Each should accept arguments config & args
// and return a promise, running resolve with arguments config & args
const installPlugins = require("./installPlugins");
const createSetup = require("./create-setup");


// Exported function
module.exports = function build(config, args) {
  // First, install plugins
  installPlugins(config, args)
    // Copy code for setup & install deps
    .then(createSetup(args));
};
