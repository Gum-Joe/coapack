// File to copy over setup
const chalk = require("chalk");
const Logger = require("coapack-logger");
const { constants } = require("coapack-utils");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const ProgressBar = require("progress");
const logger = new Logger({
  name: constants.COPY_LOGGER_NAME
});

/**
 * @description Copies dir contents to destination
 * @param source {String} Source dir
 * @param destination {String} destination
 * @param options {Object} options
 */
async function copyDirContentsTo(source, destination, options) {
  const dirsInSource = fs.readdirSync(source);
  let finalDirs = Array.concat(dirsInSource);
  // Get all files
  const getFiles = (dirs, root) => {
    for (let dir of dirs) {
      const status = fs.statSync(path.join(root, dir));
      if (!options.ignore.includes(dir) && status.isDirectory()) {
        // File is dir
        const thisDirDirs = fs.readdirSync(path.join(root, dir));
        finalDirs.push(path.join(root, dir));
        getFiles(thisDirDirs, path.join(root, dir));
      } else {
        // Append
        finalDirs.push(path.join(root, dir));
      }
    }
  };
  await getFiles(dirsInSource, source);
  // Resolve files & filter out dirs or files
  finalDirs = finalDirs.map(dir => path.isAbsolute(dir) ? dir : path.resolve(path.join(source, dir)));
  let allDirs = finalDirs.filter(dir => fs.statSync(dir).isDirectory());
  finalDirs = finalDirs.filter(dir => !fs.statSync(dir).isDirectory());
  finalDirs = finalDirs.map(dir => path.isAbsolute(dir) ? dir : path.resolve(path.join(destination, dir)));
  allDirs = allDirs.map(dir => path.resolve(path.join(destination, path.relative(source, dir))));

  // Counts
  const filesToCopy = finalDirs.length;
  const dirsToMake = allDirs.length;

  // Progress bar
  let pb = new ProgressBar(`${chalk.magenta(constants.COPY_LOGGER_NAME)} ${chalk.green("progress")} :bar :percent :current/:total :source :sign :dest ETA: :eta`, {
    total: filesToCopy + dirsToMake,
    complete: "█",
    incomplete: "▒",
    width: 50
  });

  // Copy
  // Read file and write
  console.log(`${chalk.magenta(constants.COPY_LOGGER_NAME)} ${chalk.green("progress")}`);
  // Make directories
  function mkDirs() {
    return new Promise(async function(resolve, reject) {
      for (let dir of allDirs) {
        await mkdirp(dir, (err) => {
          if (err) {
            reject(err);
          }
          pb.tick({
            source: "mkdirp",
            sign: ">>",
            dest: path.relative(process.cwd(), dir)
          });
          if (dir === allDirs[allDirs.length -1 ]) {
            resolve();
          }
        });
      }
    });
  }
  await mkDirs()
    .then(() => copyFiles())
    .catch((err) => logger.throw(err));

    // XXX: This fails on first run, saying one dir could not be copied
  function copyFiles() {
    // Copy files
    for (let file of finalDirs) {
      // Error handler
      const handleError = (err) => {
        read.destroy();
        write.end();
        logger.throw(err);
      };
      // destination
      const dest = path.join(destination, path.relative(source, file)); /* Get file name and append to destination */
      // Copy
      const read = fs.createReadStream(file); // Create read stream
      read.on("error", handleError); // Handle error
      const write = fs.createWriteStream(dest); // Create write stream
      write.on("error", handleError); // Handle error
      write.on("finish", () => pb.tick({
        source: path.relative(process.cwd(), file),
        dest: path.relative(process.cwd(), dest),
        sign: "->"
      })); // What to do when done
      read.pipe(write); // Run copy
    }
  }

}

module.exports = (source, options, destination) => {
  if (options.dir) {
    logger.debug(`Copying dir ${source}...`);
    // Get setup type
    switch (options.mode) {
    case constants.copy.RECURSIVE_DIRECT:
      copyDirContentsTo(source, destination, options);
      break;
    default:
      logger.info("Unknown mode");
    }
  }
};
