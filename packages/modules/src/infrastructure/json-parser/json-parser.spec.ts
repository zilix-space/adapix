import { JsonParserDateObject } from './json-parser'
import { describe, it, expect } from 'vitest'
import { tenantSettingsDefault, tenantSettingsSchema } from './jsons/tenant'

describe('JsonParserDateObject', () => {
  describe('parse', () => {
    it('should correctly parse and validate data with default values when current is empty', () => {
      const data = {
        default: tenantSettingsDefault,
        current: {},
        upsert: {
          billing: {
            email: 'test@example.com',
          },
        },
      }

      const result = JsonParserDateObject.parse({
        schema: tenantSettingsSchema,
        data,
      })

      expect(result.success).toBe(true)
      // @ts-expect-error - Expect error zod
      expect(result.data).toEqual({
        billing: {
          email: 'test@example.com',
        },
        integrations: {
          slack: {
            url: undefined,
          },
          discord: {
            url: undefined,
          },
          webhook: {
            url: undefined,
          },
        },
        emails: {
          usageExceededSentAt: undefined,
        },
      })
    })

    it('should return an error for invalid data', () => {
      const data = {
        default: tenantSettingsDefault,
        current: {},
        upsert: {
          billing: {
            email: 123, // Invalid type, should be string
          },
        },
      }

      const result = JsonParserDateObject.parse({
        schema: tenantSettingsSchema,
        data,
      })

      expect(result.success).toBe(false)
      // @ts-expect-error - Expect error zod
      expect(result.error).toBeDefined()
    })

    it('should correctly merge current and upsert data', () => {
      const data = {
        default: tenantSettingsDefault,
        current: {
          billing: {
            email: 'current@example.com',
          },
        },
        upsert: {
          integrations: {
            slack: {
              url: 'https://slack.example.com',
            },
          },
        },
      }

      const result = JsonParserDateObject.parse({
        schema: tenantSettingsSchema,
        // @ts-expect-error - Expect error zod
        data,
      })

      expect(result.success).toBe(true)
      // @ts-expect-error - Expect error zod
      expect(result.data).toEqual({
        billing: {
          email: 'current@example.com',
        },
        integrations: {
          slack: {
            url: 'https://slack.example.com',
          },
          discord: {
            url: undefined,
          },
          webhook: {
            url: undefined,
          },
        },
        emails: {
          usageExceededSentAt: undefined,
        },
      })
    })
  })
})
