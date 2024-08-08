import { z } from 'zod'

export const updateUserPixKycSchema = z.object({
  pix: z.string().min(1, 'O PIX é necessário'),
})
