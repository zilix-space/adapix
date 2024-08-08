'use server'

import { updatePixActionSchema } from './schemas'
import { modules } from '@app/modules/src'
import { client } from '@/services/actions/tenant-client'

export const updatePixAction = client.action({
  name: 'user.update',
  type: 'mutate',
  schema: updatePixActionSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        payment: {
          pix: input.payment.pix,
        },
      },
    })
  },
})
