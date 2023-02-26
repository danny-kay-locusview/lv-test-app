export function toWords(value: string) {
  return value?.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export function isString(value: any): boolean {
  return toString.call(value) == '[object String]';
}
