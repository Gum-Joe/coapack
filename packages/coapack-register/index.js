// Coapack plugin for registering plugins

/**
  * Module Dependencies
  */
const path = require("path");

/**
  * Register class
  * @type class
  */
class Register {
  constructor() {
    this.plugins = {};
  }

  /**
    * Register plugin
    */
  registerPlguin(plugin) {
    // Check of plugin is object
    // If it is, the user has already specified the plugin's details
    // So it can be dropped into object
    let pluginInfo = {};
    if (typeof plugin === "object") {
      pluginInfo = plugin;
    } else {
      // Only plugin name given
      // Get details
      pluginInfo = {
        name: plugin,
        path: path.join(process.cwd(), plugin)
      };
    }

    // Get package.json data
    pluginInfo.pkgJSON = require(path.join(pluginInfo.path, "package.json"));
    // Append
    this.plugins[pluginInfo.name] = pluginInfo;
  }
}

module.exports = Register;
