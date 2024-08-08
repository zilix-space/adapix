import { z } from 'zod'

export const tenantSettingsSchema = z.object({
  billing: z.object({
    email: z.string().optional(),
  }),
  integrations: z.object({
    external: z.object({
      token: z.string().optional(),
    }),
    slack: z.object({
      url: z.string().optional(),
    }),
    discord: z.object({
      url: z.string().optional(),
    }),
    webhook: z.object({
      url: z.string().optional(),
    }),
  }),
  emails: z.object({
    usageExceededSentAt: z.string().optional(),
  }),
})

export const tenantSettingsDefault: z.infer<typeof tenantSettingsSchema> = {
  billing: {
    email: undefined,
  },
  integrations: {
    external: {
      token: undefined,
    },
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
}
