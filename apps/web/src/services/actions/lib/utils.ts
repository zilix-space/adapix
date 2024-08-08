export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N
export type IsAny<T> = IfAny<T, null, T>

export type ReturnTypeWithoutPromise<T extends (...args: any) => any> =
  T extends (...args: any) => Promise<infer U> ? U : never

export type AsKeyOf<T> = keyof T
