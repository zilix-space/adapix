import { createApiHandler, sendResponse } from '@/services/http/lib'
import { modules } from '@app/modules/src'
import { z } from 'zod'

export const GET = createApiHandler({
  handler: async () => {
    const estimate = await modules.provider.market.getQuote('cardano', 'brl')
    return sendResponse(200, {
      data: estimate,
    })
  },
})

export const POST = createApiHandler({
  schemas: {
    body: z.object({
      type: z.enum(['buy', 'sell']),
      amount: z.number(),
    }),
  },
  handler: async (req, { body }) => {
    const { type, amount } = body

    const estimate =
      await modules.usecases.transaction.estimateTransaction.execute({
        type,
        amount,
      })

    return sendResponse(200, {
      data: estimate,
    })
  },
})
