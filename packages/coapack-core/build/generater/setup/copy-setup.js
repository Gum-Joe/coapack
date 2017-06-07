// File to copy setup source code
const Logger = require("coapack-logger");
const { constants } = require("coapack-utils");
const copy = require("../../../copy");
const mkdirp = require("mkdirp");
const path = require("path");
const logger = new Logger({
  name: constants.GENERATER_LOGGER_NAME
});

module.exports = {};

/**
 * Copies basline setup
 * @param config {Object} Config
 */
module.exports.createSetupBase = function createSetupBase() {
  return async (config) => {
    return new Promise(async function(resolve, reject) {
      logger.info("Copying setup base files...");
      // Copy file -> output dir
      mkdirp(config.outputFolder);
      // Basic stuff
      logger.info("Copying coapack-base-setup...");
      await copy(config.register.plugins["coapack-setup-base"].path, {
        dir: true,
        mode: constants.copy.RECURSIVE_DIRECT,
        ignore: [
          /test\//
        ]
      }, config.outputFolder)
        .then(() => resolve(config))
        .catch(err => reject(err));
    });
  };
};

/**
 * Copies setup to use
 * @param args {Object} Cli args
 * @param config {Object} Config
 */
module.exports.createSetup = (args) => {
  return function (config) {
    return new Promise(async (resolve, reject) => {
      // Copy setup
      logger.info("Copying setup...");
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

      await copy(setup.path, {
        dir: true,
        mode: constants.copy.RECURSIVE_DIRECT,
        ignore: []
      }, path.join(config.outputFolder, constants.SETUP_FOLDER))
        .then(() => resolve(config))
        .catch(err => reject(err));
    });
  };
};

/**
 * Copies app
 * @param args {Object} Cli args
 * @param config {Object} Config
 */
module.exports.copyApp = (args) => {
  return function (config) {
    return new Promise(async (resolve, reject) => {
      // Copy setup
      logger.info("Copying your app...");
      const app_path = args.source || process.cwd();
      await copy(app_path, {
        dir: true,
        mode: constants.copy.RECURSIVE_DIRECT,
        ignore: [
          /node_modules/,
          /build/,
          /test\//
        ]
      }, path.join(config.outputFolder, constants.APP_FOLDER))
        .then(() => resolve(config))
        .catch(err => reject(err));
    });
  };
};
