// Default build for coapack
// Module dependencies
const Logger = require("coapack-logger");
const logger = new Logger({
  name: "build"
});

/**
 * Default build.
 * Builds a self-extracting archieve,
 * using coapack-setup-self-extracting
 *
 * @param args {Object} CLI Options from build command
 */
module.exports = (args) => {
  logger.debug("Registering plugins...");
};
