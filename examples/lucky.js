const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

cursor.eraseScreen().reset().moveTo(0, 1)

const text = 'terminal cursor and colors.'
const colors = ['red', 'cyan', 'yellow', 'green', 'blue', 'magenta']
let offset = 0

setInterval(function () {
  let y = 0
  let dy = 1

  for (let i = 0; i < 40; i++) {
    const color = colors[(i + offset) % colors.length]
    const char = text[(i + offset) % text.length]

    cursor.move(1, dy)
    cursor[color]()
    cursor.write(char)

    y += dy
    if (y <= 0 || y >= 5) {
      dy *= -1
    }
  }

  cursor.moveTo(0, 1)
  offset += 1
}, 200)
