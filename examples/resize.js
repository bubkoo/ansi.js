#!/usr/bin/env node

var cursor = require('../')(process.stdout);

var queue = (function () {

  var tasks   = [];
  var pending = false;

  return {
    abort: function () {
      tasks = [];
      next();
    },
    push : function (t) {
      tasks.push(t);
      if (!pending) {
        next();
      }
    }
  };

  function next() {
    pending = true;
    process.nextTick(function () {
      if (tasks.length === 0) {
        return;
      }
      var t = tasks.shift();
      t();
      pending = false;
      next();
    });
  }
})();

process.stdout.on('resize', draw);

draw();

function draw() {

  var cols = process.stdout.columns;
  var rows = process.stdout.rows;

  queue.abort();

  queue.push(function () {
    cursor
      .eraseScreen()
      .reset()
      .magenta()
      .moveTo(1, 1)
      .write(Array(cols + 1).join('█') + '\n');
  });

  for (var x = 2; x < rows; x++) {
    (function (x) {
      queue.push(function () {
        cursor
          .moveTo(x, 1)
          .write('█')
          .moveTo(x, cols)
          .write('█');
      });
    })(x);
  }

  queue.push(function () {
    cursor
      .moveTo(rows - 1, cols)
      .write(Array(cols + 1).join('█'))
      .moveTo(Math.floor(rows / 2), Math.floor(cols / 2))
      .write('█')
      .fg.reset();
  });
}

process.stdin.read();
