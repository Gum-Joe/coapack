/**
 * Builder
 * Handles building the app & getting ready for packaging
 * @param config {Object} Config to use
 */
const path = require("path");
const { constants } = require("coapack-utils");
// Functions needed
// Each should accept arguments config & args
// and return a promise, running resolve with arguments config & args
const installPlugins = require("./installPlugins");
const { createSetupBase, createSetup, copyApp } = require("../generater/setup/copy-setup");
const installSetupDeps = require("../generater/setup/install-setup-deps");
const Logger = require("coapack-logger");
const logger = new Logger({ name: "copack" });


// Exported function
module.exports = async function build(config, args) {
  // First, install plugins
  installPlugins(config, args)
    // Copy code for setup
    .then(await createSetupBase(args))
    .then(await createSetup(args))
    .then(await copyApp(args))
    // Install deps
    .then(await installSetupDeps(config.outputFolder, args))
    .then(await installSetupDeps(path.resolve(config.outputFolder, constants.APP_FOLDER), args))
    .then(await installSetupDeps(path.resolve(config.outputFolder, constants.SETUP_FOLDER), args))
    // Package
    //
    .catch(err => logger.throw(err));

};
