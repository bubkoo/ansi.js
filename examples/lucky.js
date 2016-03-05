#!/usr/bin/env node

var cursor = require('../')(process.stdout);

cursor
  .eraseScreen()
  .reset()
  .moveTo(0, 1);


var text   = 'terminal cursor and colors.';
var colors = ['red', 'cyan', 'yellow', 'green', 'blue', 'magenta'];
var offset = 0;

setInterval(function () {

  var y  = 0;
  var dy = 1;

  for (var i = 0; i < 40; i++) {

    var color = colors[(i + offset) % colors.length];
    var char  = text[(i + offset) % text.length];

    cursor.move(1, dy);
    cursor[color]();
    cursor.write(char);

    y += dy;
    if (y <= 0 || y >= 5) {
      dy *= -1;
    }
  }

  cursor.moveTo(0, 1);
  offset++;

}, 200);
