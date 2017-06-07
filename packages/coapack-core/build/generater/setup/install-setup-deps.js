/**
 * Install setup deps with yarn or npm
 */
const async = require("async");
const chalk = require("chalk");
const { spawn } = require("child_process");
const { constants } = require("coapack-utils");
const Logger = require("coapack-logger");
const npm = require("npm");
const path = require("path");
const logger = new Logger({
  name: constants.INSTALL_LOGGER_NAME
});

// Exported function
module.exports = function installSetupDeps(dir, args) {
  return function (config) {
    // Yarn or npm?
    return new Promise(async function(resolve, reject) {
      logger.info(`Installing dependencies in ${chalk.cyan(path.resolve(dir))}...`);
      process.chdir(path.resolve(dir));
      logger.debug(`In directory: ${process.cwd()}`);
      await npm.load({
        loaded: false
      }, function (err) {
        // catch errors
        if (err) {
          reject(err);
        }
        npm.commands.install([], async function (er, data) {
          await process.chdir(path.resolve(".."));
          if (er) {
            reject(er);
          }
          console.log(""); // Insert line so we don't overlap npm
          logger.info("Done.");
          resolve(config);
        });
        npm.on("log", function (message) {
          // log the progress of the installation
          logger.info(message);
        });
      });
    });
  };
};
