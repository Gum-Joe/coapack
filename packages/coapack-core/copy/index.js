// File to copy over setup
const chalk = require("chalk");
const Logger = require("coapack-logger");
const { constants, matchRegexArray } = require("coapack-utils");
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
      if (!matchRegexArray(dir, options.ignore) && status.isDirectory()) {
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
  allDirs = allDirs.filter(dir => !matchRegexArray(dir, options.ignore));

  // Hacky solution to fix issue where dir would not copy if no subdris
  allDirs.unshift(source);

  // Counts
  const filesToCopy = finalDirs.length;
  const dirsToMake = allDirs.length;


  // Copy
  // Read file and write
  console.log(`${chalk.magenta(constants.COPY_LOGGER_NAME)} ${chalk.green("progress")}`);
  // Make directories
  function mkDirs(pb) {
    return new Promise(async function(resolve, reject) {
      for (let dir of allDirs) {
        if (!matchRegexArray(dir, options.ignore)) {
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
      }
    });
  }

    // XXX: This fails on first run, saying one dir could not be copied
  function copyFiles(pb) {
    // Copy files
    return new Promise(async function(resolve, reject) {
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
        write.on("finish", () => {
          pb.tick({
            source: path.relative(source, file),
            dest: path.relative(source, dest),
            sign: "->"
          });
          read.destroy();
          write.end();
        }); // What to do when done
        await read.pipe(write); // Run copy
      }
    });
  }

  return new Promise(async (resolve, reject) => {
    // Progress bar
    let pb = new ProgressBar(`${chalk.magenta(constants.COPY_LOGGER_NAME)} ${chalk.green("progress")} :bar :percent :current/:total :source :sign :dest ETA: :eta`, {
      total: filesToCopy + dirsToMake,
      complete: "█",
      incomplete: "▒",
      width: 50,
      callback: () => { console.log(""); /* Log \n for neatness */ resolve(); }
    });
    await mkDirs(pb)
      .then(() => copyFiles(pb))
      .catch(err => reject(err));
  });

}

module.exports = (source, options, destination) => {
  if (options.dir) {
    logger.debug(`Copying dir ${path.relative(process.cwd(), source)} to ${path.relative(process.cwd(), destination)}...`);
    // Get setup type
    switch (options.mode) {
    case constants.copy.RECURSIVE_DIRECT:
      return copyDirContentsTo(source, destination, options);
    default:
      logger.err("Unknown copy mode");
    }
  }
};
