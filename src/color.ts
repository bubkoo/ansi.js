import { Base } from './base'
import { Cursor } from './cursor'
import { extend } from './util'
import { prefix, suffix, colors } from './constants'

export class Color extends Base {
  public readonly radix: number
  private current: string | number | null

  constructor(cursor: Cursor, radix: number) {
    super(cursor)
    this.radix = radix
    this.current = null
  }

  set(code: string | number): this {
    if (this.current !== code) {
      this.cursor.write(`${prefix}${code}${suffix}`)
      this.current = code
    }

    return this
  }

  reset(): this {
    this.set(this.radix + 39)
    this.current = null
    return this
  }

  rgb(r: number, g: number, b: number): this {
    const base = this.radix + 38
    const code = rgb(r, g, b)

    this.set(`${base};5;${code}`)
    return this
  }

  hex(color: string): this {
    return this.rgb(...toRGB(color))
  }
}

export interface Color {
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
}

Object.keys(colors).forEach((color: keyof typeof colors) =>
  extend(Color, color, function () {
    return this.set(this.radix + colors[color])
  }),
)

/**
 * Translates a 255 RGB value to a 0-5 ANSI RGV value,
 * then returns the single ANSI color code to use.
 */
function rgb(r: number, g: number, b: number) {
  const red = (r / 255) * 5
  const green = (g / 255) * 5
  const blue = (b / 255) * 5

  return rgb5(red, green, blue)
}

/**
 * Turns rgb 0-5 values into a single ANSI color code to use.
 */
function rgb5(r: number, g: number, b: number) {
  const red = Math.round(r)
  const green = Math.round(g)
  const blue = Math.round(b)

  return 16 + red * 36 + green * 6 + blue
}

/**
 * Accepts a hex CSS color code string (# is optional) and
 * translates it into an Array of 3 RGB 0-255 values, which
 * can then be used with rgb().
 */
function toRGB(color: string): [number, number, number] {
  const c = color[0] === '#' ? color.substring(1) : color
  const r = c.substring(0, 2)
  const g = c.substring(2, 4)
  const b = c.substring(4, 6)

  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}
