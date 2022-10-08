const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

cursor.eraseScreen().reset()

const radius = 5
let theta = 0
let points = []

setInterval(function () {
  const x = 2 + (radius + Math.cos(theta) * radius) * 2
  const y = 2 + radius + Math.sin(theta) * radius

  points.unshift([x, y])

  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']

  points.forEach(function (p, i) {
    cursor.moveTo(p[0], p[1])

    const c = colors[Math.floor(i / 12)]

    cursor.background[c]()
    cursor.write(' ')
  })

  points = points.slice(0, 12 * colors.length - 1)

  theta += Math.PI / 40
}, 50)
