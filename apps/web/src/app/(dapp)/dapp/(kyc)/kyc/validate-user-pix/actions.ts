'use server'

import { client } from '@/services/actions/user-client'
import { updateUserPixKycSchema } from './schema'
import { modules } from '@app/modules/src'

export const updateUserPixKyc = client.action({
  name: 'user.kyc.update',
  type: 'mutate',
  schema: updateUserPixKycSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        payment: {
          pix: input.pix,
        },
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-document',
    }
  },
})
