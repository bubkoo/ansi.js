#!/usr/bin/env node

var ansi   = require('../');
var cursor = ansi(process.stdout);

var ix = 0;
var iv = setInterval(function () {

  charm.background(ix++).write(' ');

  if (ix === 256) {
    clearInterval(iv);
    cursor.write('\n');
    cursor.display.reset();
    process.exit();
  }

}, 10);
