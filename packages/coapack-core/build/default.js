// Default build for coapack
// Module dependencies
const Logger = require("coapack-logger");
const Register = require("coapack-register");
const logger = new Logger({
  name: "build"
});
const PLUGINS = [
  "coapack-setup-self-extracting"
];

/**
 * Default build.
 * Builds a self-extracting archieve,
 * using coapack-setup-self-extracting
 *
 * @param args {Object} CLI Options from build command
 */
module.exports = (args) => {
  logger.debug("Registering plugins...");
  const register = new Register();
  for (let plugin of PLUGINS) {
    register.registerPlugin(plugin);
  }
  register.install(args, (err) => {
    if (err) {
      logger.throw(err);
    } else {
      // Next: make coapack-setup-self-extracting build setup
    }
  });
};
