export function ucFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

export function toAxis(val: number) {
  return typeof val === 'undefined' ||
    Number.isNaN(val) ||
    !Number.isFinite(val)
    ? 1
    : Math.floor(val)
}

export function extend<T>(
  base: new (...args: any[]) => T,
  methodName: string,
  method: (this: T) => T,
) {
  base.prototype[methodName] = method
}
