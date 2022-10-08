const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

cursor.write('Progress: 0 %')

let i = 0

var iv = setInterval(function () {
  cursor.backward(i.toString().length + 2)

  i++

  cursor.write(`${i} %`)

  if (i === 100) {
    cursor.write('\nDone!\n')
    clearInterval(iv)
  }
}, 25)
