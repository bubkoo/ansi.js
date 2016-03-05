#!/usr/bin/env node

var cursor = require('../')(process.stdout);
var hexArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
var hex    = ['0', '0', '0', '0', '0', '0'];

function write() {
  cursor.hex(hex.join('')).write('█');
}

write();

var iv = setInterval(function () {

  for (var i = 0; i < 6; i++) {
    var index = hexArr.indexOf(hex[i]);
    if (index < 15) {
      hex[i] = hexArr[index + 1];
      return write();
    }
  }

  clearInterval(iv);
  cursor.fg.reset();
  cursor.write('\n');

}, 10);
