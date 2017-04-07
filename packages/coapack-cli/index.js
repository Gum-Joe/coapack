// Coapack cli entry point
const Cli = require("lib/cli");
const commands = require("commands");
const cli = new Cli(
  [
    [ "--color",  "Use colour"],
    [ "--no-color",  "Don't use colour"]
  ],
  process.argv
);

cli.usage("<command> [options...]");

for (let cmd in commands) {
  if (commands.hasOwnProperty(cmd)) {
    cli.command(cmd.name, cmd.desc, cmd.code);
  }
}
