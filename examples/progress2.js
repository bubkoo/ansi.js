#!/usr/bin/env node

/**
 * Like GNU ncurses "clear" command.
 * https://github.com/mscdex/node-ncurses/blob/master/deps/ncurses/progs/clear.c
 */


var cursor = require('../')(process.stdout);

process.title = 'clear';

function lf() {
  return '\n';
}


console.log(process.stdout.getWindowSize());

//require('../')(process.stdout)
//  .write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join(''))
//  .eraseData(2)
//  .goto(1, 1)

