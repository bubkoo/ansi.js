/**
 *
 * ANSI/VT100 Terminal Control Escape Sequences
 *
 * ref:
 *  - https://en.wikipedia.org/wiki/ANSI_escape_code
 *  - http://www.termsys.demon.co.uk/vtansi.htm
 *  - http://ispltd.org/mini_howto:ansi_terminal_codes
 *
 * synonym:
 *  - https://www.npmjs.com/package/ansi
 *  - https://www.npmjs.com/package/charm
 *  - https://www.npmjs.com/package/ansi-escapes
 */


var Cursor = require('./lib/cursor');


function ansi(stream, options) {
  if (stream._ansiCache) {
    return stream._ansiCache;
  } else {
    return stream._ansiCache = new Cursor(stream, options);
  }
}


ansi.Cursor = Cursor;


// exports
// -------

module.exports = ansi;
