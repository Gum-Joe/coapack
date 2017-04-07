// Logging module for coapack
const chalk = require("chalk");

module.exports = class Logger {
  constructor(args) {
    this.args = args;
    this.argv = process.argv;
  }

  // Logger methods
  /**
   * Basic Logger
   * @param level {String} Log Level
   * @param colour {String} colour of string
   * @param text {String} Text to log
   */
  _log(level, colour, text) {
    if (!this.argv.includes("--silent")) {
      console.log(`${chalk[colour](level)} ${text}`);
    }
  }
  /*
   * Info method
   * @color green
   */
  info(text) {
    this._log("info", "green", text);
  }

  /*
   * Warn method
   * @color green
   */
  warn(text) {
    this._log("warn", "yellow", text);
  }
  /*
   * Error method
   * @color green
   */
  err(text) {
    this._log("err", "red", text);
  }

  /*
   * Debug/verbose method
   * @color green
   */
  debug(text) {
    if (this.argv.includes("--debug") || this.argv.includes("--verbose") || this.argv.includes("-v") || process.env.DEBUG) {
      this._log("debug", "cyan", text);
    }
  }
};
