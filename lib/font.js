var consts = require('./consts');

var prefix = consts.prefix;
var suffix = consts.suffix;
var styles = consts.styles;
var resets = consts.resets;

var styleNames = Object.keys(styles);


function Font(cursor) {
  this.cursor = cursor;
  this.setDefault();
}


// exports
// -------

module.exports = Font;


// proto
// -----

styleNames.forEach(function (styleName) {

  var propName  = getPropName(styleName);
  var styleCode = styles[styleName];
  var resetCode = resets[styleName];

  Font.prototype[styleName] = function () {

    if (this[propName]) {
      return this;
    }

    this.cursor._write(prefix + styleCode + suffix);
    this[propName] = true;
    return this;
  };

  Font.prototype['reset' + ucFirst(styleName)] = function () {

    if (!this[propName]) {
      return this;
    }

    this.cursor._write(prefix + resetCode + suffix);
    this[propName] = false;
    return this;
  };

});

Font.prototype.setDefault = function () {
  Object.keys(styles).forEach(function (style) {
    this[getPropName(style)] = false;
  }.bind(this));

  return this;
};

Font.prototype.end = function () {
  return this.cursor;
};


// helpers
// -------

function getPropName(styleName) {
  return 'is' + ucFirst(styleName);
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}
