// Build prep. function
// Modules dependencies
const { constants } = require("coapack-utils");
const build = require("./builder");
const fs = require("fs");
const pack = require("../package.json");
const defaultBuild = require("./default");
const Logger = require("coapack-logger");
const logger = new Logger({
  name: constants.BUILD_LOGGER_NAME
});

module.exports = function (args, config) {
  logger.info("Coapack build engine");
  logger.info(`v${pack.version}`);
  logger.info("");

  // Check if config exists
  if (!config) {
    // Config not given as arg
    logger.debug("Looking for config...");
    fs.access(args.config || constants.DEFAULT_CONFIG_NAME, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err && err.code !== "ENOENT") {
        // Some other error prevented us looking for the config
        logger.throw(err);
      } else if (err.code === "ENOENT") {
        // Run a default, self extract package
        logger.warn("No config found.  Run \"coapack generate config\" to create one");
        logger.info("Continuing with a self-extracting package build...");
        defaultBuild(args);
      } else {
        logger.debug("Config found.");
        logger.debug("Reading config...");
        config = require(args.config || constants.DEFAULT_CONFIG_NAME);
        // Build
        build(config);
      }
    });
  } else {
    logger.debug("Config specified.");
    // Build
    build(config, args);
  }
};
