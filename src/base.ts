import { Cursor } from './cursor'

export class Base {
  constructor(public readonly cursor: Cursor) {}

  end() {
    return this.cursor
  }
}
