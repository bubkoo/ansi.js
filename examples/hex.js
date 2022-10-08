const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

const hexArr = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
]
const hex = ['0', '0', '0', '0', '0', '0']

function write() {
  cursor.hex(hex.join('')).write('█')
}

write()

const iv = setInterval(function () {
  for (let i = 0; i < 6; i++) {
    const index = hexArr.indexOf(hex[i])
    if (index < 15) {
      hex[i] = hexArr[index + 1]
      return write()
    }
  }

  clearInterval(iv)
  cursor.foreground.reset()
  cursor.write('\n')
}, 10)
