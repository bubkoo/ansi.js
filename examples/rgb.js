#!/usr/bin/env node

var cursor = require('../')(process.stdout);

var r = 0;
var g = 0;
var b = 0;

var iv = setInterval(function () {

  cursor
    .rgb(r, g, b)
    .write('█');

  if (r < 255) {
    r += 1;
  } else {
    if (g < 255) {
      g += 1;
    } else {
      b += 1;
    }
  }

  if (r >= 255 && g >= 255 && b > 255) {
    clearInterval(iv);
    cursor.fg.reset();
    cursor.write('\n');
  }

}, 10);
