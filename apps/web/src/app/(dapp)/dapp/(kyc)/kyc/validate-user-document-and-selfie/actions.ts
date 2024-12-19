'use server'

import { client } from '@/services/actions/user-client'
import { updateUserDocumentWithSelfieKycSchema } from './schema'
import { modules } from '@app/modules/src'
import { indier } from '@/services/indier'
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

    await indier.analytics.event.create({
      event: 'onboarding-finished',
      channel: 'user-journey',
      title: 'Onboarding Finished',
      description: `Onboarding finished for @${context.user.username}`,
      icon: '🧡',
      identity: {
        identityId: '',
        email: context.user.email,
        name: context.user.name,
        phone: context.user.settings.contact.phone,
        image: context.user.image,
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-data',
    }
  },
})
