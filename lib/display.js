var consts = require('./consts');
var prefix = consts.prefix;
var suffix = consts.suffix;
var types  = consts.display;


function Display(cursor) {
  this.cursor  = cursor;
  this.current = null;
}


// exports
// -------

module.exports = Display;


// proto
// -----

Object.keys(types).forEach(function (methodName) {

  var code = types[methodName];

  Display.prototype[methodName] = function () {

    if (this.current !== code) {
      this.current = code;
      this.cursor._write(prefix + code + suffix);
    }

    return this;
  };
});

Display.prototype.end = function () {
  return this.cursor;
};
