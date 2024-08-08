import { z } from 'zod'

export const updateProfileActionSchema = z.object({
  image: z.string().optional().nullish(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  telegram: z.string().optional(),
  address: z.object({
    state: z.string().optional(),
    city: z.string().optional(),
    neighborhood: z.string().optional(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
  }),
})
