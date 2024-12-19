import KycError from '@/emails/kyc-error'
import KycSuccess from '@/emails/kyc-success'

import { APP_CONFIGS } from '@/boilerplate.config'
import { createApiHandler, sendResponse } from '@/services/http/lib'
import { modules } from '@app/modules/src'
import { renderAsync } from '@react-email/components'
import { z } from 'zod'
import { db } from '@app/db'
import {
  KYCRejectionReason,
  KYCStatus,
} from '@app/modules/src/domain/entities/User'

export const revalidate = 0

export const PUT = createApiHandler({
  schemas: {
    body: z.object({
      userId: z.string(),
      status: z.nativeEnum(KYCStatus),
      reasons: z.array(z.nativeEnum(KYCRejectionReason)).optional(),
    }),
    query: z.object({
      token: z.string(),
    }),
  },
  handler: async (_, { body, query }) => {
    const { userId, status, reasons } = body
    const { token } = query

    if (token !== process.env.ADMIN_TOKEN) {
      return sendResponse(401, {
        message: 'Unauthorized',
      })
    }

    const user = await modules.usecases.user.getUserById.execute(userId)

    if (!user) {
      return sendResponse(404, {
        message: 'User not found',
      })
    }

    await modules.usecases.user.updateUser.execute(userId, {
      status: status === 'approved' ? 'ACTIVE' : 'PENDING',
      settings: {
        kyc: {
          status,
          reasons,
        },
      },
    })

    if (status === 'approved') {
      await modules.provider.mail.send({
        from: APP_CONFIGS.providers.mail.resend.from,
        to: user.email,
        subject: `Documentos validados com sucesso - ${APP_CONFIGS.app.name}`,
        body: await renderAsync(
          KycSuccess({ email: user.email, name: user.name }),
        ),
      })
    }

    if (status === 'rejected') {
      await modules.provider.mail.send({
        from: APP_CONFIGS.providers.mail.resend.from,
        to: user.email,
        subject: `Documentos inválidos - ${APP_CONFIGS.app.name}`,
        body: await renderAsync(
          KycError({ email: user.email, name: user.name, reasons }),
        ),
      })
    }

    return sendResponse(200, {
      message: 'KYC status updated',
    })
  },
})

export const GET = createApiHandler({
  handler: async () => {
    const usersPending = await db.user.findMany({
      where: {
        settings: {
          path: ['kyc', 'status'],
          equals: 'submitted',
        },
      },
    })

    const mappedUsers = usersPending.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      kyc: {
        status: user.settings.kyc.status,
        reasons: user.settings.kyc.reasons,
        data: user.settings.kyc.data,
      },
    }))

    return sendResponse(200, {
      message: `${usersPending.length} users waiting for KYC`,
      data: mappedUsers,
    })
  },
})
