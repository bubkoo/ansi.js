import { Cursor, Options } from './cursor'

const cache = new WeakMap<NodeJS.WriteStream, Cursor>()

export default function ansi(stream: NodeJS.WriteStream, options?: Options) {
  if (cache.has(stream)) {
    return cache.get(stream)!
  }
  const cursor = new Cursor(stream, options)
  cache.set(stream, cursor)
  return cursor
}

export { Cursor, Options, ansi }
