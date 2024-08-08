import { z } from 'zod'

export const sendFeedbackActionSchema = z.object({
  message: z.string(),
})
