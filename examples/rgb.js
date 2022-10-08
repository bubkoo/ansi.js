const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

let r = 0
let g = 0
let b = 0

var iv = setInterval(function () {
  cursor.rgb(r, g, b).write('█')

  if (r < 255) {
    r += 1
  } else {
    if (g < 255) {
      g += 1
    } else {
      b += 1
    }
  }

  if (r >= 255 && g >= 255 && b > 255) {
    clearInterval(iv)
    cursor.foreground.reset()
    cursor.write('\n')
  }
}, 10)
