'use server'

import { client } from '@/services/actions/tenant-client'
import { sendFeedbackActionSchema } from './schemas'

export const sendFeedbackAction = client.action({
  name: 'send.feedback',
  type: 'mutate',
  schema: sendFeedbackActionSchema,
  handler: async ({ context, input }) => {
    console.log({
      context,
      input,
    })
  },
})
