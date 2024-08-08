import { createApiHandler, sendResponse } from '@/services/http/lib'
import { userAuthMiddleware } from '@/services/http/user-auth'

import { z } from 'zod'
import { modules } from '@app/modules/src'

export const revalidate = 0

export const GET = createApiHandler({
  middlewares: [userAuthMiddleware],
  handler: async (req, { user }) => {
    return sendResponse(200, {
      data: user,
    })
  },
})

export const PUT = createApiHandler({
  middlewares: [userAuthMiddleware],
  schemas: {
    body: z.object({
      pixKey: z.string().optional(),
      walletAddress: z.string().optional(),
    }),
  },
  handler: async (req, { user, body }) => {
    await modules.usecases.user.updateUser.execute(user.id, {
      settings: {
        payment: {
          pix: body.pixKey,
          wallet: body.walletAddress,
        },
      },
    })

    return sendResponse(200, {
      data: {
        pix: body.pixKey,
        wallet: body.walletAddress,
      },
    })
  },
})
