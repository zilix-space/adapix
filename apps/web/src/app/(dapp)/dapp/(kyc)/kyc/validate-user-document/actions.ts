'use server'

import { client } from '@/services/actions/user-client'
import { updateUserDocumentKycSchema } from './schema'
import { modules } from '@app/modules/src'

export const updateUserDocumentKyc = client.action({
  name: 'user.kyc.update',
  type: 'mutate',
  schema: updateUserDocumentKycSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        kyc: {
          data: {
            attachments: {
              documentFront: input.documentFront,
              documentBack: input.documentBack,
            },
          },
        },
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-document-and-selfie',
    }
  },
})
