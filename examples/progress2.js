#!/usr/bin/env node

var cursor = require('../')(process.stdout);


cursor.write('Progress: 0 %');

var i = 0;

var iv = setInterval(function () {

  cursor.backward(i.toString().length + 2);

  i++;

  cursor.write(i + ' %');

  if (i === 100) {
    cursor.write('\nDone!\n');
    clearInterval(iv);
  }

}, 25);

