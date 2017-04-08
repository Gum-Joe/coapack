// Build function
// Modules dependencies
const { constants } = require("coapack-utils");
const fs = require("fs");
const pack = require("../package.json");
const defaultBuild = require("./default");
const Logger = require("coapack-logger");
const logger = new Logger({
  name: "build"
});

module.exports = function build(args, config) {
  logger.info("Coapack build engine");
  logger.info(`v${pack.version}`);
  logger.info("");

  // Check if config exists
  if (!config) {
    // Config not given as arg
    logger.debug("Looking for config...");
    fs.access(constants.DEFAULT_CONFIG_NAME, fs.constants.R_OK | fs.constants.W_OK, (err) => {
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
      }
    });
  } else {
    logger.debug("Config specified.");
  }
};
