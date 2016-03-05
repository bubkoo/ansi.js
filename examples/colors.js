#!/usr/bin/env node

var cursor = require('../')(process.stdout);
var consts = require('../lib/consts');
var colors = Object.keys(consts.colors);

var iv = setInterval(function () {

  var colorName = colors.pop();

  if (colorName) {
    cursor[colorName]().write('█');
  } else {
    clearInterval(iv);
    cursor.fg.reset();
    cursor.write('\n');
  }

}, 10);

