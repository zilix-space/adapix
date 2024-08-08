import { SafeParseReturnType, ZodSchema } from 'zod'

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface JsonData<T> {
  default: T
  current?: T
  upsert?: DeepPartial<T>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class JsonParserDateObject<T extends object> {
  private static compareAndSave<T extends object>(
    currentValue: T,
    newValue: DeepPartial<T>,
  ): T {
    if (typeof currentValue === 'object' && typeof newValue === 'object') {
      if (Array.isArray(currentValue) && Array.isArray(newValue)) {
        if (currentValue.length !== newValue.length) {
          return [...newValue] as T
        } else {
          const updatedArray = currentValue.map((item, index) =>
            JsonParserDateObject.compareAndSave(
              item,
              newValue[index] as DeepPartial<T>,
            ),
          ) as unknown as T[]
          return updatedArray as T
        }
      } else {
        const updatedObject = { ...currentValue }
        const allKeys = Array.from(
          new Set([...Object.keys(currentValue), ...Object.keys(newValue)]),
        )
        for (const key of allKeys) {
          if (newValue[key as keyof T] !== undefined) {
            const newValueFieldValue = newValue[key as keyof T]

            if (
              typeof newValueFieldValue === 'string' &&
              newValueFieldValue.trim() === ''
            ) {
              updatedObject[key as keyof T] = undefined as any
            } else {
              updatedObject[key as keyof T] =
                JsonParserDateObject.compareAndSave(
                  currentValue[key as keyof T] as any,
                  newValue[key as keyof T] as any,
                ) as any
            }
          }
        }
        return updatedObject as T
      }
    } else {
      if (newValue === undefined) {
        return currentValue
      }

      return newValue as T
    }
  }

  static parse<T extends object>(config: {
    schema: ZodSchema<T>
    data: JsonData<T>
  }): SafeParseReturnType<T, T> {
    const { schema, data } = config

    const {
      default: defaultValue = {} as T,
      current = {} as T,
      upsert: newValue = {} as DeepPartial<T>,
    } = data || {}

    if (!current || Object.keys(current).length === 0) {
      const comparedData = JsonParserDateObject.compareAndSave(
        defaultValue,
        newValue,
      )
      return schema.safeParse(comparedData) as SafeParseReturnType<T, T>
    }

    const oldConfig = JsonParserDateObject.compareAndSave(defaultValue, current)
    const updatedConfig = JsonParserDateObject.compareAndSave(
      oldConfig,
      newValue,
    )

    const result = schema.safeParse(updatedConfig) as SafeParseReturnType<T, T>

    if (result.success) {
      return result
    }

    if (result.success === false && result.error.issues.length === 1) {
      const [issue] = result.error.issues

      if (
        issue.code === 'invalid_type' &&
        ((issue.path?.length === 2 &&
          issue.path?.[0] === 'current' &&
          issue.path?.[1] === 'config') ||
          (issue.path?.length === 1 && issue.path?.[0] === 'config'))
      ) {
        const comparedData = JsonParserDateObject.compareAndSave(
          defaultValue,
          newValue,
        )
        return schema.safeParse(comparedData) as SafeParseReturnType<T, T>
      }
    }

    return result as SafeParseReturnType<T, T>
  }
}
