// File to copy setup source code
const Logger = require("coapack-logger");
const { constants } = require("coapack-utils");
const copy = require("../../copy");
const mkdirp = require("mkdirp");
const logger = new Logger({
  name: constants.GENERATER_LOGGER_NAME
});

module.exports = function createSetup(args) {
  return (config) => {
    logger.info("Copying setup files...");
    let setup;
    // Go through and find setups
    if (!args.setup) {
      for (let plugin in config.register.plugins) {
        if (config.register.plugins.hasOwnProperty(plugin) && config.register.plugins[plugin].pkgJSON.coapack.type === constants.TYPE_SETUP_ID) {
          setup = config.register.plugins[plugin];
        }
      }
    } else {
      config.register.registerPlugin(args.setup);
      setup = config.register.plugins[args.setup];
    }
    logger.debug(`Setup: ${setup.name}`);
    // Copy file -> output dir
    mkdirp(config.outputFolder);
    // Basic stuff
    logger.info("Copying coapack base setup...");
    copy(config.register.plugins["coapack-setup-base"].path, {
      dir: true,
      mode: constants.copy.RECURSIVE_DIRECT,
      ignore: []
    }, config.outputFolder);
  };
};
