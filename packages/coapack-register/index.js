// Coapack plugin for registering plugins

/**
  * Module Dependencies
  */
const Logger = require("coapack-logger");
const path = require("path");
const fs = require("fs");
const install = require("./install");

/**
  * Register class
  * @type class
  */
class Register {
  constructor() {
    this.plugins = {};
    this.logger = new Logger({
      name: "register"
    });

    // Add functions
    this.install = install.bind(this);
  }

  /**
    * Register plugin
    */
  registerPlugin(plugin) {
    // Check of plugin is object
    // If it is, the user has already specified the plugin's details
    // So it can be dropped into object
    let pluginInfo = {};
    if (typeof plugin === "object") {
      pluginInfo = plugin;
      // Validate
      if (!pluginInfo.hasOwnProperty("name")) {
        // error, no name
        throw new Error("Package given with no name! (ENONAME)");
      } else if (!pluginInfo.hasOwnProperty("path")) {
        // No path
        pluginInfo.path = path.join(process.cwd(), "node_modules", pluginInfo.name);
      } else if (pluginInfo.hasOwnProperty("path")) {
        pluginInfo.path = path.resolve(pluginInfo.path);
      }
    } else {
      this.logger.debug(`Registering plguin ${plugin}...`);
      // Only plugin name given
      // Get details
      pluginInfo = {
        name: plugin,
        path: path.join(process.cwd(), "node_modules", plugin)
      };
    }

    // Get package.json if it exists
    fs.access(path.join(pluginInfo.path, "package.json"), fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err && err.code !== "ENOENT") {
        // Some other error prevented us looking for the config
        this.logger.throw(err);
      } else if (err.code === "ENOENT") {
        this.logger.debug(`Plugin ${pluginInfo.name} not installed.`);
        pluginInfo.toInstall = true;
      } else {
        // Plugin installed
        pluginInfo.pkgJSON = require(path.join(pluginInfo.path, "package.json"));
      }

      // Append
      this.plugins[pluginInfo.name] = pluginInfo;
    });
  }
}

module.exports = Register;
