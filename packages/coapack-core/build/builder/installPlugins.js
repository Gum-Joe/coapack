// Build module for installing plugins
const Logger = require("coapack-logger");
const Register = require("coapack-register");
const { constants } = require("coapack-utils");
const logger = new Logger({
  name: constants.BUILD_LOGGER_NAME
});

/**
 * Installs plugins
 */
module.exports = function installPlugins(config, args) {
  logger.debug("Registering plugins...");
  const register = new Register();
  for (let plugin of config.plugins) {
    register.registerPlugin(plugin);
  }
  return new Promise(function(resolve) {
    register.install(args, (err) => {
      if (err && !args.force) {
        new Logger({
          name: constants.REGISTER_LOGGER_NAME
        }).throw(err);
      } else {
        // Done!
        config.register = register;
        resolve(config);
      }
    });
  });
};
