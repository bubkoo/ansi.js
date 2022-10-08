/*
 * Invokes the terminal `beep` sound once
 * per second on every exact second.
 */

const { ansi } = require('../lib')

const cursor = ansi(process.stdout)

process.title = 'beep'

function beep() {
  cursor.beep()
  setTimeout(beep, 1000 - new Date().getMilliseconds())
}

setTimeout(beep, 1000 - new Date().getMilliseconds())
