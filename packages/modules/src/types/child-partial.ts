export type ChildPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? ChildPartial<T[P]>
    : T[P]
}
