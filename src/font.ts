import { Base } from './base'
import { Cursor } from './cursor'
import { extend, ucFirst } from './util'
import { prefix, suffix, fontStyles, fontResets } from './constants'

export class Font extends Base {
  private isBold: boolean
  private isItalic: boolean
  private isUnderline: boolean
  private isInverse: boolean

  constructor(cursor: Cursor) {
    super(cursor)
    this.reset()
  }

  reset() {
    this.isBold = false
    this.isItalic = false
    this.isInverse = false
    this.isUnderline = false
    return this
  }
}

export interface Font {
  bold(): this
  italic(): this
  underline(): this
  inverse(): this

  resetBold(): this
  resetItalic(): this
  resetUnderline(): this
  resetInverse(): this
}

Object.keys(fontStyles).forEach((styleName: keyof typeof fontStyles) => {
  const propName = `is${ucFirst(styleName)}` as
    | 'isBold'
    | 'isItalic'
    | 'isInverse'
    | 'isUnderline'
  const styleCode = fontStyles[styleName]
  const resetCode = fontResets[styleName]

  extend(Font, styleName, function () {
    if (this[propName]) {
      return this
    }

    this.cursor.write(prefix + styleCode + suffix)
    this[propName] = true
    return this
  })

  extend(Font, `reset${ucFirst(styleName)}`, function () {
    if (!this[propName]) {
      return this
    }

    this.cursor.write(prefix + resetCode + suffix)
    this[propName] = false
    return this
  })
})
