import { z } from 'zod'

export const updateUserDocumentWithSelfieKycSchema = z.object({
  selfie: z.string().min(1, 'A selfie é necessária'),
})
