'use server'

import { client } from '@/services/actions/user-client'
import { updateUserPhoneKycSchema } from './schema'
import { modules } from '@app/modules/src'

export const updateUserPhoneKyc = client.action({
  name: 'user.kyc.update',
  type: 'mutate',
  schema: updateUserPhoneKycSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        contact: {
          phone: input.phone,
        },
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-pix',
    }
  },
})
