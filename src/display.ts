import { Base } from './base'
import { Cursor } from './cursor'
import { extend } from './util'
import { prefix, suffix, displayTypes } from './constants'

export class Display extends Base {
  protected current: number | null
  constructor(cursor: Cursor) {
    super(cursor)
    this.current = null
  }

  set(code: number): this {
    if (this.current !== code) {
      this.current = code
      this.cursor.write(`${prefix}${code}${suffix}`)
    }

    return this
  }
}

export interface Display {
  reset(): this
  bright(): this
  dim(): this
  underscore(): this
  blink(): this
  reverse(): this
  hidden(): this
}

Object.keys(displayTypes).forEach((type: keyof typeof displayTypes) => {
  const code = displayTypes[type]
  extend(Display, type, function () {
    return this.set(code)
  })
})
