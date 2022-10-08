const assert = require('assert')
const { ansi } = require('../lib')

function Progress(stream, width) {
  this.cursor = ansi(stream, { lineTrack: true })
  this.delta = this.cursor.newlines
  this.width = width | 0 || 10
  this.open = '['
  this.close = ']'
  this.complete = '█'
  this.incomplete = '_'

  // initial render
  this.progress = 0
}

Object.defineProperty(Progress.prototype, 'progress', {
  get,
  set,

  configurable: true,
  enumerable: true,
})

function get() {
  return this._progress
}

function set(v) {
  this._progress = Math.max(0, Math.min(v, 100))

  const w = this.width - this.complete.length - this.incomplete.length
  const n = (w * (this._progress / 100)) | 0
  const i = w - n
  const com = c(this.complete, n)
  const inc = c(this.incomplete, i)
  const delta = this.cursor.newlines - this.delta

  assert.equal(com.length + inc.length, w)

  if (delta > 0) {
    this.cursor.moveUp(delta)
    this.delta = this.cursor.newlines
  }

  this.cursor
    .moveToColumn(0)
    .eraseLine()
    .white()
    .write(this.open)
    .grey()
    .bold()
    .write(com)
    .resetBold()
    .write(inc)
    .white()
    .write(this.close)
    .foreground.reset()
    .end()
    .write('\n')
}

function c(char, length) {
  return Array.apply(null, Array(length))
    .map(function () {
      return char
    })
    .join('')
}

// Usage
const width =
  parseInt(process.argv[2], 10) || process.stdout.getWindowSize()[0] / 2
const progressBar = new Progress(process.stdout, width)

;(function tick() {
  progressBar.progress += Math.random() * 5
  progressBar.cursor
    .eraseLine()
    .write('Progress: ')
    .bold()
    .write(progressBar.progress.toFixed(2))
    .write('%')
    .resetBold()
    .write('\n')

  if (progressBar.progress < 100) {
    setTimeout(tick, 100)
  }
})()
