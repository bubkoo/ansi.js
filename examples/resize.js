const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

const queue = (function () {
  let tasks = []
  let pending = false

  return {
    abort() {
      tasks = []
      next()
    },
    push(t) {
      tasks.push(t)
      if (!pending) {
        next()
      }
    },
  }

  function next() {
    pending = true
    process.nextTick(function () {
      if (tasks.length === 0) {
        return
      }
      const t = tasks.shift()
      t()
      pending = false
      next()
    })
  }
})()

process.stdout.on('resize', draw)

draw()

function draw() {
  const cols = process.stdout.columns
  const rows = process.stdout.rows

  queue.abort()

  queue.push(function () {
    cursor
      .eraseScreen()
      .reset()
      .magenta()
      .moveTo(1, 1)
      .write(`${Array(cols + 1).join('█')}\n`)
  })

  for (let x = 2; x < rows; x++) {
    queue.push(function () {
      cursor.moveTo(x, 1).write('█').moveTo(x, cols).write('█')
    })
  }

  queue.push(function () {
    cursor
      .moveTo(rows - 1, cols)
      .write(Array(cols + 1).join('█'))
      .moveTo(Math.floor(rows / 2), Math.floor(cols / 2))
      .write('█')
      .foreground.reset()
  })
}

process.stdin.read()
