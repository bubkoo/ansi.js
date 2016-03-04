var util       = require('util');
var consts     = require('./consts');
var Background = require('./background');

var fontStyles      = consts.fontStyles;
var resetFontStyles = consts.resetFontStyles;


function Foreground(cursor) {
  this.cursor  = cursor;
  this.current = null;
}

util.inherits(Foreground, Background);


// exports
// -------

module.exports = Foreground;


// proto
// -----

Foreground.prototype.radix = 0;


// helpers
// -------

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}
