const { ansi } = require('../lib')
const consts = require('../lib/constants')

const cursor = ansi(process.stdout)

const colors = Object.keys(consts.colors)
const iv = setInterval(() => {
  const colorName = colors.pop()
  if (colorName) {
    cursor[colorName]().write('█')
  } else {
    clearInterval(iv)
    cursor.foreground.reset()
    cursor.write('\n')
  }
}, 10)
