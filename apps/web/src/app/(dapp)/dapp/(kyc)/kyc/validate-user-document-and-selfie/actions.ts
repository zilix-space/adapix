'use server'

import { client } from '@/services/actions/user-client'
import { updateUserDocumentWithSelfieKycSchema } from './schema'
import { modules } from '@app/modules/src'
import { KYCStatus } from '@app/modules/src/domain/entities/User'

export const updateUserDocumentWithSelfieKyc = client.action({
  name: 'user.kyc.update',
  type: 'mutate',
  schema: updateUserDocumentWithSelfieKycSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        kyc: {
          status: KYCStatus.SUBMITTED,
          data: {
            attachments: {
              selfie: input.selfie,
            },
          },
        },
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-data',
    }
  },
})
