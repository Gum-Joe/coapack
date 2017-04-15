// Default Promise
module.exports = function DEFAULT_PROMISE(config, args) {
  return new Promise((resolve) => {
    resolve(config, args);
  });
};
