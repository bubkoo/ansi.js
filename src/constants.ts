export const beep = '\x07' // makes a beep sound
export const prefix = '\x1b[' // for all escape codes
export const suffix = 'm' // only for color codes

export const movements = {
  moveTo: 'H',
  forceTo: 'f',
  moveUp: 'A',
  moveDown: 'B',
  forward: 'C',
  backward: 'D',
  nextLine: 'E',
  prevLine: 'F',
  moveToColumn: 'G',
  scrollUp: 'S',
  scrollDown: 'T',
  deleteLine: 'M',
  deleteChar: 'M',
}

export const actions = {
  hide: '?25l',
  show: '?25h',
  eraseRight: 'K',
  eraseLeft: '1K',
  eraseLine: '2K',
  eraseDown: 'J',
  eraseUp: '1J',
  eraseScreen: '2J',
}

export const codes = {
  resetDevice: '\x1bc',
  getPosition: '6n',
  savePosition: 's',
  restorePosition: 'u',
  saveCursor: '7',
  restoreCursor: '8',
}

export const fontStyles = {
  bold: 1,
  italic: 3,
  underline: 4,
  inverse: 7,
}

export const fontResets = {
  bold: 22,
  italic: 23,
  underline: 24,
  inverse: 27,
}

export const displayTypes = {
  reset: 0,
  bright: 1,
  dim: 2,
  underscore: 4,
  blink: 5,
  reverse: 7,
  hidden: 8,
}

export const colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  grey: 90,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
}
