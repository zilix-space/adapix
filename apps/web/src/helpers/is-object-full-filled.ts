export function isObjectFullFilled<T>(
  obj: T,
  ignore: (keyof T)[] = [],
): boolean {
  if (Object.keys(obj).length === 0) return false

  for (const key in obj) {
    if (ignore.includes(key as keyof T)) continue
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      return false
    }
  }

  return true
}
