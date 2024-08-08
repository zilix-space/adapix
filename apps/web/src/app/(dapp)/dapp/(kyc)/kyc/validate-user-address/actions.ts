'use server'

import { client } from '@/services/actions/user-client'
import { updateUserAddressKycSchema } from './schema'
import { modules } from '@app/modules/src'

export const updateUserAddressKyc = client.action({
  name: 'user.kyc.update',
  type: 'mutate',
  schema: updateUserAddressKycSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        kyc: {
          data: {
            address: {
              city: input.city,
              state: input.state,
              neighborhood: input.neighborhood,
              zipCode: input.zipCode,
              street: input.street,
              number: input.number,
            },
          },
        },
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-phone',
    }
  },
})
