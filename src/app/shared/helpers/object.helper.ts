export function isArray(arg: any): arg is any[] {
  return Array.isArray(arg);
}

export function isFunction(arg: any): arg is Function {
  return arg?.constructor && {}.toString.call(arg) === "[object Function]";
}

export function isObject(arg: any): arg is Object {
  return typeof arg === 'object' && !isArray(arg) && arg !== null;
}

export function isEqual(a: any, b: any): boolean {
  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((key) => a[key] === b[key]);
  } else if (isArray(a) && isArray(b)) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
  } else {
    return a === b;
  }
}
