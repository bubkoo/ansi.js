import newlineEvent from 'on-new-line'
import { Font } from './font'
import { Color } from './color'
import { Display } from './display'
import { extend, toAxis, ucFirst } from './util'
import {
  actions,
  beep,
  movements,
  prefix,
  colors,
  fontStyles,
  codes,
  displayTypes,
  suffix,
} from './constants'

export interface Options {
  /**
   * When `enabled` is `false` then all the methods are no-ops except for
   * `forceWrite()`.
   * Default `true`.
   */
  enabled?: boolean
  /**
   * When `buffering` is true, then `write()` calls are buffered in memory
   * until `flush()` is invoked.
   * Default `false`.
   */
  buffering?: boolean
  /**
   * Keep track of the number of `lineCount` that get encountered.
   * Default `false`.
   */
  lineTrack?: boolean
}

export class Cursor {
  enabled: boolean
  buffering: boolean
  lineCount: number

  public readonly stream: NodeJS.WriteStream
  public readonly font: Font
  public readonly display: Display
  public readonly foreground: Color
  public readonly background: Color
  public readonly bufferData: string[]

  constructor(stream: NodeJS.WriteStream, options: Options = {}) {
    if (typeof stream !== 'object' || typeof stream.write !== 'function') {
      throw new Error('A valid Stream instance must be passed in.')
    }

    this.stream = stream

    this.font = new Font(this)
    this.display = new Display(this)
    this.foreground = new Color(this, 0)
    this.background = new Color(this, 10)

    let enabled = options.enabled
    if (typeof enabled === 'undefined') {
      enabled = stream.isTTY
    }
    this.enabled = enabled !== false

    // when `buffering` is true, then `write()` calls are buffered
    // in memory until `flush()` is invoked.
    this.buffering = options.buffering === true
    this.bufferData = []

    // keep track of the number of `newline` that get encountered
    if (options.lineTrack === true) {
      this.lineCount = 0

      newlineEvent(stream)

      stream.on('newline', () => {
        this.lineCount += 1
      })
    }
  }

  enable(): this {
    this.enabled = true
    return this
  }

  disable(): this {
    this.enabled = false
    return this
  }

  forceWrite(data: string): this {
    if (this.buffering) {
      this.bufferData.push(data)
    } else {
      this.stream.write(data)
      this.stream.emit('data', data)
    }

    return this
  }

  write(data: string): this {
    if (this.enabled) {
      this.forceWrite(data)
    }
    return this
  }

  /**
   * Set `cursor.buffering` truly, when `cursor.buffering` is `true`, then
   * `write()` calls are buffered in memory until `flush()` is invoked.
   */
  buffer(): this {
    this.buffering = true
    return this
  }

  /**
   *  Write out the in-memory buffer, then set `cursor.buffering` falsely.
   */
  flush(): this {
    this.buffering = false
    const output = this.bufferData.join('')

    // clean
    this.bufferData.length = 0

    return this.forceWrite(output)
  }

  rgb(r: number, g: number, b: number): this {
    this.foreground.rgb(r, g, b)
    return this
  }

  hex(color: string): this {
    this.foreground.hex(color)
    return this
  }

  /**
   * Move the cursor position by the relative coordinates `dx`and `dy`.
   */
  move(dx: number, dy: number): this {
    // set relative coordinates
    if (dy < 0) {
      this.moveUp(-dy)
    } else if (dy > 0) {
      this.moveDown(dy)
    }

    if (dx > 0) {
      this.forward(dx)
    } else if (dx < 0) {
      this.backward(-dx)
    }

    return this
  }

  /**
   * Play a beeping sound.
   */
  beep(): this {
    return this.write(beep)
  }

  erase(
    type: '$' | '^' | 'left' | 'right' | 'line' | 'down' | 'up' | 'screen',
  ): this {
    if (type) {
      if (type === '$') {
        return this.eraseRight()
      }
      if (type === '^') {
        return this.eraseLeft()
      }
      const methodName = `erase${ucFirst(`${type}`)}` as keyof typeof actions
      if (this[methodName]) {
        return this[methodName]()
      }
    }

    this.stream.emit('error', new Error(`Unknown erase type: ${type}`))

    return this
  }

  delete(type: 'line' | 'char', n: number): this {
    if (type) {
      const methodName = `delete${ucFirst(`${type}`)}` as
        | 'deleteLine'
        | 'deleteChar'
      if (this[methodName]) {
        return this[methodName](n)
      }
    }

    this.stream.emit('error', new Error(`Unknown delete type: ${type}`))

    return this
  }

  insert(mode: boolean | 'line' | 'char', n = 1): this {
    if (mode === true) {
      return this.write(`${prefix}4h`)
    }
    if (mode === false) {
      return this.write(`${prefix}l`)
    }
    if (mode === 'line') {
      return this.write(`${prefix + n}L`)
    }
    if (mode === 'char') {
      return this.write(`${prefix + n}@`)
    }

    this.stream.emit('error', new Error(`Unknown insert type: ${mode}`))

    return this
  }

  save(withAttributes?: boolean): this {
    const code =
      prefix + (withAttributes ? codes.saveCursor : codes.savePosition)

    return this.write(code)
  }

  restore(withAttributes?: boolean): this {
    const code =
      prefix + (withAttributes ? codes.restoreCursor : codes.restorePosition)

    return this.write(code)
  }

  /**
   * Reset all terminal settings to default
   */
  reset(): this {
    this.font.reset()
    this.foreground.reset()
    this.background.reset()
    this.display.reset()

    this.write(codes.resetDevice)
    this.write(prefix + displayTypes.reset + suffix)

    return this
  }
}

export interface Cursor {
  // movements
  /**
   * Set the cursor position to the absolute coordinates `x`, `y`.
   */
  moveTo(x: number, y: number): this
  /**
   * Force set the cursor position to the absolute coordinates `x`, `y`.
   */
  forceTo(x: number, y: number): this
  /**
   * Move the cursor up by `x` (default 1) rows.
   */
  moveUp(x?: number): this
  /**
   * Move the cursor down by `x` (default 1) rows.
   */
  moveDown(x?: number): this
  /**
   * Move the cursor forward by `y` (default 1) columns.
   */
  forward(y?: number): this
  /**
   * Move the cursor backward by `y` (default 1) columns.
   */
  backward(y?: number): this
  /**
   * Moves the cursor to column `y` (default 1).
   */
  moveToColumn(y?: number): this
  nextLine(n?: number): this
  prevLine(n?: number): this
  /**
   * Scroll whole page up by `n` (default 1) lines. New lines are added at the bottom.
   */
  scrollUp(n?: number): this
  /**
   * Scroll whole page down by `n` (default 1) lines. New lines are added at the top.
   */
  scrollDown(n?: number): this
  deleteLine(n?: number): this
  deleteChar(n?: number): this

  // actions
  hide(): this
  show(): this
  eraseRight(): this
  eraseLeft(): this
  eraseLine(): this
  eraseDown(): this
  eraseUp(): this
  eraseScreen(): this

  // foreground colors
  black(): this
  red(): this
  green(): this
  yellow(): this
  blue(): this
  magenta(): this
  cyan(): this
  white(): this
  grey(): this
  brightBlack(): this
  brightRed(): this
  brightGreen(): this
  brightYellow(): this
  brightBlue(): this
  brightMagenta(): this
  brightCyan(): this
  brightWhite(): this

  // font styles
  blod(): this
  italic(): this
  underline(): this
  inverse(): this
  resetBold(): this
  resetItalic(): this
  resetUnderline(): this
  resetInverse(): this
}

Object.keys(movements).forEach((movement: keyof typeof movements) => {
  const code = movements[movement]
  extend(Cursor, movement, function (...axis: number[]) {
    let c: string | number
    if (axis.length === 1 || axis.length === 0) {
      c = axis[0] == null ? 1 : axis[0]
    } else {
      c = axis.map(toAxis).join(';')
    }
    return this.write(prefix + c + code)
  })
})

Object.keys(actions).forEach((action: keyof typeof actions) => {
  const code = actions[action]
  extend(Cursor, action, function () {
    return this.write(prefix + code)
  })
})

Object.keys(colors).forEach((color: keyof typeof colors) => {
  extend(Cursor, color, function () {
    this.foreground[color]()
    return this
  })
})

Object.keys(fontStyles).forEach((styleName: keyof typeof fontStyles) => {
  extend(Cursor, styleName, function () {
    this.font[styleName]()
    return this
  })

  const resetName = `reset${ucFirst(styleName)}` as
    | 'resetBold'
    | 'resetItalic'
    | 'resetInverse'
    | 'resetUnderline'

  extend(Cursor, resetName, function () {
    this.font[resetName]()
    return this
  })
})
