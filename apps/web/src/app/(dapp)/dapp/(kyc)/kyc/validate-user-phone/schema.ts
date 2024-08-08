import { z } from 'zod'

export const updateUserPhoneKycSchema = z.object({
  phone: z.string().min(1, 'O telefone é necessário'),
})
