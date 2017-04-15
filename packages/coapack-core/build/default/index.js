// Default build for coapack
// Module dependencies
const build = require("../builder");
const Logger = require("coapack-logger");
const { constants } = require("coapack-utils");
const genConfig = require("./genConfig");
const logger = new Logger({
  name: constants.BUILD_LOGGER_NAME
});


/**
 * Default build.
 * Builds a self-extracting archieve,
 * using coapack-setup-self-extracting
 *
 * @param args {Object} CLI Options from build command
 */
module.exports = (args) => {
  genConfig()
    .then((config) => {
      // Next: run a noraml build
      build(config, args);
    })
    .catch(err => logger.throw(err));
};
