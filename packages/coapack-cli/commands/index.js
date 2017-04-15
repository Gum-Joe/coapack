// Commands for bedel
/**
 * Module depedencies
 */
const core = require("coapack-core");
const Cli = require("../lib/cli");

// Export
module.exports = [
  {
    name: "build",
    desc: "Builds and packages the app in the current directory",
    code(argv) {
      const cli = new Cli(
        [
          ["--config", "Specify a config file"],
          ["-f, --force", "Force build"],
          ["--setup <package>", "Supply the setup you want to use from the cli (must already be installed)"],
          ["--use-npm", "Force use npm for installing package"]
        ],
        {
          script: "coapack-build",
          subCommand: true
        },
        argv
      );
      // Parse + run
      const options = cli.parse();
      core.build(options);
    }
  }
];
