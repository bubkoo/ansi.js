var consts = require('./consts');
var prefix = consts.prefix;
var suffix = consts.suffix;
var colors = consts.colors;


function Colour(cursor, radix) {
  this.radix   = radix;
  this.cursor  = cursor;
  this.current = null;
}


// exports
// -------

module.exports = Colour;


// proto
// -----

Object.keys(colors).forEach(function (color) {
  var code = colors[color];

  Colour.prototype[color] = function () {
    return this._setColorCode(this.radix + code);
  };
});

Colour.prototype._setColorCode = function (code) {

  if (this.current !== code) {
    this.cursor._write(prefix + String(code) + suffix);
    this.current = code;
  }

  return this;
};

Colour.prototype.reset = function () {
  this._setColorCode(this.radix + 39);
  this.current = null;
  return this;
};

Colour.prototype.rgb = function (r, g, b) {

  var base = this.radix + 38;
  var code = rgb(r, g, b);

  this._setColorCode(base + ';5;' + code);
  return this;
};

Colour.prototype.hex = function (color) {
  return this.rgb.apply(this, hex(color));
};

Colour.prototype.end = function () {
  return this.cursor;
};


// Helpers
// -------

function rgb(r, g, b) {

  /**
   * Translates a 255 RGB value to a 0-5 ANSI RGV value,
   * then returns the single ANSI color code to use.
   */

  var red   = r / 255 * 5;
  var green = g / 255 * 5;
  var blue  = b / 255 * 5;

  return rgb5(red, green, blue);
}

function rgb5(r, g, b) {

  /**
   * Turns rgb 0-5 values into a single ANSI color code to use.
   */

  var red   = Math.round(r);
  var green = Math.round(g);
  var blue  = Math.round(b);

  return 16 + (red * 36) + (green * 6) + blue;
}

function hex(color) {

  /**
   * Accepts a hex CSS color code string (# is optional) and
   * translates it into an Array of 3 RGB 0-255 values, which
   * can then be used with rgb().
   */

  var c = color[0] === '#' ? color.substring(1) : color;
  var r = c.substring(0, 2);
  var g = c.substring(2, 4);
  var b = c.substring(4, 6);

  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
