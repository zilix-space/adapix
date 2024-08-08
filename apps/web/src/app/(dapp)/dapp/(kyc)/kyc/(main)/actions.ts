'use server'

import { client } from '@/services/actions/user-client'
import { updateUserDataKycSchema } from './schema'
import { getUTMSFromSSR } from '@/helpers/get-ssr.utms'
import { modules } from '@app/modules/src'
import { indier } from '@/services/indier'

export const updateUserDataKyc = client.action({
  name: 'user.kyc.update',
  type: 'mutate',
  schema: updateUserDataKycSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await modules.usecases.user.updateUser.execute(user.id, {
      name: input.name,
      settings: {
        kyc: {
          data: {
            name: input.name,
            document: input.document,
            birthdate: input.birthDate,
          },
        },
        utms: getUTMSFromSSR(),
      },
    })

    await indier.analytics.event.create({
      event: 'onboarding-started',
      channel: 'user-journey',
      title: 'Onboarding Started',
      description: `Onboarding started for @${context.user.username}`,
      icon: '🪪',
      identity: {
        identityId: '',
        email: context.user.email,
        name: context.user.name,
        phone: context.user.settings.contact.phone,
        image: context.user.image,
      },
    })

    return {
      redirect: '/dapp/kyc/validate-user-address',
    }
  },
})
