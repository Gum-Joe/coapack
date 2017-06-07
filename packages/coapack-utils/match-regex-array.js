/**
 * Files to match string againstarray of regex expressions
 */

// From http://stackoverflow.com/questions/10152650/javascript-match-regular-expression-against-the-array-of-items
module.exports = function (string, expressions) {
  const len = expressions.length;
  for (let i = 0; i < len; i++) {
    if (string.match(expressions[i])) {
      return true;
    }
  }
  return false;

};
