import { z } from 'zod'

export const updateUserDocumentKycSchema = z.object({
  documentFront: z.string().min(1, 'O documento é necessário'),
  documentBack: z.string().min(1, 'O documento é necessário'),
})
