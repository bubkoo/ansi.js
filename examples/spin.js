#!/usr/bin/env node

var cursor = require('../')(process.stdout);

cursor
  .eraseScreen()
  .reset();

var radius = 5;
var theta  = 0;
var points = [];

setInterval(function () {
  var x = 2 + (radius + Math.cos(theta) * radius) * 2;
  var y = 2 + radius + Math.sin(theta) * radius;

  points.unshift([x, y]);

  var colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

  points.forEach(function (p, i) {

    cursor.moveTo(p[0], p[1]);

    var c = colors[Math.floor(i / 12)];

    cursor.bg[c]();
    cursor.write(' ')

  });

  points = points.slice(0, 12 * colors.length - 1);

  theta += Math.PI / 40;

}, 50);
