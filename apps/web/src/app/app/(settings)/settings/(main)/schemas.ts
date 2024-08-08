import { z } from 'zod'

export const updateProfileActionSchema = z.object({
  image: z.string().optional().nullish(),
  name: z.string().optional().nullish(),
  email: z.string().optional().nullish(),
  settings: z.object({
    contact: z.object({
      phone: z.string().optional(),
    }),
    utms: z.object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
    }),
    kyc: z.object({
      status: z.enum(['pending', 'approved', 'rejected']),
      statusReason: z.string().optional(),
      data: z.object({
        document: z.string().optional(),
        birthdate: z.string().optional(),
        address: z.object({
          country: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          neighborhood: z.string().optional(),
          zipCode: z.string().optional(),
          street: z.string().optional(),
          number: z.string().optional(),
        }),
        attachments: z.object({
          selfie: z.string().optional(),
          documentFront: z.string().optional(),
          documentBack: z.string().optional(),
        }),
      }),
    }),
  }),
})
