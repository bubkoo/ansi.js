var Font         = require('./font');
var Colour       = require('./colour');
var consts       = require('./consts');
var Display      = require('./display');
var newlineEvent = require('on-new-line');


function Cursor(stream, options) {

  if (!(this instanceof Cursor)) {
    return new Cursor(stream, options);
  }

  if (typeof stream !== 'object' || typeof stream.write !== 'function') {
    throw new Error('A valid Stream instance must be passed in.');
  }

  options = options || {};

  // the stream to use
  this.stream = stream;

  // when `enabled` is false then all the
  // methods are no-ops except for `write()`.
  this.enabled = options.enabled;
  if (typeof this.enabled === 'undefined') {
    this.enabled = stream.isTTY;
  }
  this.enabled = !!this.enabled;

  // when `buffering` is true, then `write()` calls are buffered
  // in memory until `flush()` is invoked.
  this.buffering = !!options.buffering;
  this._buffer   = [];

  // controls the foreground and background colors
  this.fg = this.foreground = new Colour(this, 0);
  this.bg = this.background = new Colour(this, 10);

  // controls the font style
  this.font = new Font(this);

  // controls the display mode
  this.display = new Display(this);

  // keep track of the number of `newline` that get encountered
  if (options.lineTrack === true) {
    this.newlines = 0;

    newlineEvent(stream);

    stream.on('newline', function () {
      this.newlines++;
    }.bind(this));
  }
}


// exports
// -------

module.exports = Cursor;


// proto
// -----

Cursor.prototype.enable = function () {
  this.enabled = true;
  return this;
};

Cursor.prototype.disable = function () {
  this.enabled = false;
  return this;
};

Cursor.prototype.write = function (data) {

  /**
   * Helper function that calls `write()` on the underlying Stream.
   * Returns `this` instead of the write() return value to keep
   * the chaining going.
   */

  if (this.buffering) {
    this._buffer.push(arguments);
  } else {
    this.stream.write.apply(this.stream, arguments);
    this.stream.emit('data', data);
  }

  return this;
};

Cursor.prototype._write = function (data) {

  if (this.enabled) {
    this.write(data);
  }

  return this;
};

Cursor.prototype.buffer = function () {
  this.buffering = true;
  return this;
};

Cursor.prototype.flush = function () {

  // write out the in-memory buffer

  this.buffering = false;

  var output = this._buffer.map(function (args) {
    if (args.length !== 1) {
      throw new Error('Unexpected args length: ' + args.length);
    }
    return args[0];
  }).join('');

  this._buffer = [];

  return this.write(output);
};


var prefix    = consts.prefix;
var suffix    = consts.suffix;
var codes     = consts.codes;
var colors    = consts.colors;
var styles    = consts.styles;
var actions   = consts.actions;
var display   = consts.display;
var movements = consts.movements;


Object.keys(movements).forEach(function (methodName) {

  var code = String(movements[methodName]);

  Cursor.prototype[methodName] = function () {
    var c = code;
    if (arguments.length > 0) {
      c = toArray(arguments).map(toAxis).join(';') + code
    }

    return this._write(prefix + c);
  };
});

Object.keys(actions).forEach(function (methodName) {

  var code = String(actions[methodName]);

  Cursor.prototype[methodName] = function () {
    return this._write(prefix + code);
  };
});

// foreground
Object.keys(colors).forEach(function (colorName) {
  Cursor.prototype[colorName] = function () {
    this.fg[colorName]();
    return this;
  };
});

Cursor.prototype.rgb = function (r, g, b) {
  this.fg.rgb(r, g, b);
  return this;
};

Cursor.prototype.hex = function (color) {
  this.fg.hex(color);
  return this;
};

// font style
Object.keys(styles).forEach(function (styleName) {

  Cursor.prototype[styleName] = function () {
    this.font[styleName]();
    return this;
  };

  var resetName = 'reset' + ucFirst(styleName);

  Cursor.prototype[resetName] = function () {
    this.font[resetName]();
    return this;
  };
});

Cursor.prototype.move = function (x, y) {
  // set relative coordinates
  if (y < 0) {
    this.moveUp(-y)
  } else if (y > 0) {
    this.moveDown(y)
  }

  if (x > 0) {
    this.forward(x)
  } else if (x < 0) {
    this.backward(-x)
  }

  return this;
};

Cursor.prototype.beep = function () {
  return this._write(consts.beep);
};

Cursor.prototype.erase = function (type) {

  if (type) {
    if (type === '$') {
      return this.eraseRight();
    } else if (type === '^') {
      return this.eraseLeft();
    } else {
      var methodName = 'erase' + ucFirst('' + type);
      if (this[methodName]) {
        return this[methodName]();
      }
    }
  }

  this.emit('error', new Error('Unknown erase type: ' + type));

  return this;
};

Cursor.prototype.delete = function (type, n) {

  if (type) {
    var methodName = 'delete' + ucFirst('' + type);
    if (this[methodName]) {
      return this[methodName](n);
    }
  }

  this.emit('error', new Error('Unknown delete type: ' + type));

  return this;
};

Cursor.prototype.insert = function (mode, n) {

  n = n || 1;

  if (mode === true) {
    return this._write(prefix + '4h');
  } else if (mode === false) {
    return this._write(prefix + 'l');
  } else if (mode === 'line') {
    return this._write(prefix + n + 'L');
  } else if (mode === 'char') {
    return this._write(prefix + n + '@');
  }

  this.emit('error', new Error('Unknown insert type: ' + mode));

  return this;
};

Cursor.prototype.save = function (withAttributes) {

  var code = prefix + (withAttributes ? codes.saveCursor : codes.savePosition);

  return this._write(code);
};

Cursor.prototype.restore = function (withAttributes) {

  var code = prefix + (withAttributes ? codes.restoreCursor : codes.restorePosition);

  return this._write(code);
};

Cursor.prototype.reset = function () {

  this._write(codes.resetDevice);
  this._write(prefix + display.reset + suffix);

  this.font.setDefault();
  this.fg.current      = null;
  this.bg.current      = null;
  this.display.current = null;

  return this;
};


// helpers
// -------

function isUndefined(val) {
  return typeof val === 'undefined';
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function toAxis(val) {
  return isUndefined(val) || isNaN(val) || !isFinite(val)
    ? 1
    : Math.floor(val);
}

function toArray(arr) {
  var ret = [];
  for (var i = 0, l = arr.length; i < l; i++) {
    ret.push(arr[i]);
  }
  return ret;
}
