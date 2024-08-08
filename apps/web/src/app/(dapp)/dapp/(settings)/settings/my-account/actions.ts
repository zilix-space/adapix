'use server'

import { updateProfileActionSchema } from './schemas'
import { modules } from '@app/modules/src'
import { client } from '@/services/actions/tenant-client'

export const updateUserProfileAction = client.action({
  name: 'user.update',
  type: 'mutate',
  schema: updateProfileActionSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      name: input.name,
      image: input.image,
      settings: {
        contact: {
          phone: input.phone,
          telegram: input.telegram,
        },
        kyc: {
          data: {
            address: input.address,
          },
        },
      },
    })
  },
})
