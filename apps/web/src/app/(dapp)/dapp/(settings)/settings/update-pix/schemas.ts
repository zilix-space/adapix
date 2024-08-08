import { z } from 'zod'

export const updatePixActionSchema = z.object({
  payment: z.object({
    pix: z.string().optional(),
  }),
})
