// Coapack function to make config
// TODO: Add ability to supply options from cli
const chalk = require("chalk");
const inquirer = require("inquirer");
const path = require("path");
const localPack = require(path.join(process.cwd(), "package.json"));
const PLUGINS = [
  "coapack-setup-base",
  "coapack-setup-self-extracting"
];

// Constants
const DEFAULTS = {
  app_name: localPack.name,
  app_id: `com.${localPack.author.toLowerCase()}.${localPack.name}`,
  output: "build",
  arch: process.arch,
  platform: process.platform
};
const QUESTIONS = [
  {
    type: "input",
    name: "app_name",
    message: `What's the name of your application? ${chalk.cyan("(" + DEFAULTS.app_name + ")")}`
  },
  {
    type: "input",
    name: "app_id",
    message: `What would you like you app id to be? ${chalk.cyan("(" + DEFAULTS.app_id + ")")}`
  },
  {
    type: "input",
    name: "output",
    message: `Where would you like us to store the setup? ${chalk.cyan("(" + DEFAULTS.output + ")")}`
  },
  {
    type: "checkbox",
    name: "arch",
    message: `What architectures would you like to build for? ${chalk.cyan("(" + DEFAULTS.arch + ")")}`,
    choices: [
      { name: "ia32", checked: process.arch === "ia32" },
      { name: "x64", checked: process.arch === "x64" },
      { name: "armv7l", checked: process.arch === "armv7l" }
    ]
  },
  {
    type: "checkbox",
    name: "platform",
    message: `Which platorms would you like to build for? ${chalk.cyan("(" + DEFAULTS.platform + ")")}`,
    choices: [
      { name: "linux", checked: process.platform === "linux" },
      { name: "win32", checked: process.platform === "win32" }
    ]
  }
];

if (process.platform === "darwin") {
  // Only build for macOS on macOS
  QUESTIONS[4].choices.push({ name: "darwin", checked: process.platform === "darwin" });
  QUESTIONS[4].choices.push({ name: "mas", checked: process.platform === "darwin" });
}

/**
 * Function to make a config for default build
 */
module.exports = function genConfig() {
  return new Promise(function (resolve, reject) {
    inquirer.prompt(QUESTIONS).then((answers) => {
      // Put in defaults
      for (let prop in answers) {
        if (answers.hasOwnProperty(prop) && answers[prop] === "" || answers[prop] === []) {
          answers[prop] = DEFAULTS[prop];
        }
      }
      // Export config
      const config = {
        name: answers.app_name,
        id: answers.app_id,
        plugins: PLUGINS,
        build: {
          arch: answers.arch,
          platform: answers.platform
        },
        outputFolder: answers.output
      };
      // Hand to normal build
      console.log(""); // Log \n for neatness
      resolve(config);
    });
  });
};
