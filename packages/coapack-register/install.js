// Register install function
// Installs packages that are missing
const chalk = require("chalk");
const { exec } = require("child_process");
const which = require("which");
const YARN_INSTALL = " add";
const NPM_INSTALL = " install";

/**
 * Installer.  Installs plugins
 * @param cmd {String} command to use
 * @param plugins {Array} array of plugins to install
 * @param logger {Logger} logger
 * @param cb {Function} callback
 */
const _installWith = (cmd, plugins, logger, cb) => {
  // Create install string
  let packages = "";
  for (let plugin in plugins) {
    if (plugins.hasOwnProperty(plugin)) {
      packages += chalk.magenta(plugins[plugin].name);
    }
  }
  // Log
  logger.info(`Installing packages ${packages}...`);
  logger.debug(`${chalk.cyan("exec")} ${cmd} ${chalk.stripColor(packages)} --color`);
  exec(`${cmd} ${chalk.stripColor(packages)}`, (err, stdout, stderr) => {
    if (err) {
      cb(err);
    }
    stdout.split("\n").forEach((out) => logger._log("stdout", "yellow", out));
    stderr.split("\n").forEach((out) => logger._log("stderr", "red", out));
    // Done!
    cb(null);
  });
};

/**
 * Exported install() function
 * @param args {Object} cli args object
 * @param cb {Function} callback
 */
module.exports = function install(args, cb) {
  // Get the package manager available
  which("yarn", (err, yarnResolved) => {
    if (err && err.code !== "ENONENT") {
      // Some other error stopping us finding yarn
      this.logger.throw(err);
    } else if (err && err.code === "ENONENT" || args["use_npm"]) {
      // Not found, use npm
      which("npm", (err, npmResolved) => {
        if (err && err.code !== "ENONENT") {
          // Some other error stopping us finding yarn
          this.logger.throw(err);
        } else if (err && err.code === "ENONENT") {
          // Could not find npm
          this.logger.err("No package manager (npm/yarn) found.  You may need to manually install plugins.");
          process.exit(1);
        } else {
          // Install
          _installWith("\"" + npmResolved + "\"" + NPM_INSTALL, this.plugins, this.logger, cb);
        }
      });
    } else {
      // Install packages with yarn
      _installWith(yarnResolved + YARN_INSTALL, this.plugins, this.logger, cb);
    }
  });
};
