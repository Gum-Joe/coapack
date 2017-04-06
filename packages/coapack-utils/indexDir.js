const fs = require("fs");
const path = require("path");

module.exports.indexDir = (pathToIndex) => {
  const indexPath = path.resolve(pathToIndex);
  return fs.readdirSync(indexPath)
    .filter(file => fs.statSync(path.join(indexPath, file)).isDirectory());
};
