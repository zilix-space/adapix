import { createApiHandler, sendResponse } from '@/services/http/lib'
import { userAuthMiddleware } from '@/services/http/user-auth'
import { modules } from '@app/modules/src'
import { z } from 'zod'
import { db } from '@app/db'

export const revalidate = 0

export const GET = createApiHandler({
  middlewares: [userAuthMiddleware],
  handler: async (req, { user }) => {
    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
      },
    })

    return sendResponse(200, {
      data: transactions.map((transaction) => {
        const addresses = {
          WITHDRAW: transaction.exchangeAddress,
          DEPOSIT: transaction.paymentAddress,
        }

        return {
          id: transaction.id,
          status: transaction.status,
          type: transaction.type,

          fromAmount: transaction.fromAmount,
          toAmount: transaction.toAmount,

          fromCurrency: transaction.fromCurrency,
          toCurrency: transaction.toCurrency,

          addressToPay: addresses[transaction.type],
          addressToReceive: transaction.addressToReceive,

          completedAt: transaction.completedAt,
          expiresAt: transaction.expiresAt,
          updatedAt: transaction.updatedAt,
          createdAt: transaction.createdAt,
        }
      }),
    })
  },
})

export const POST = createApiHandler({
  middlewares: [userAuthMiddleware],
  schemas: {
    body: z.object({
      type: z.enum(['buy', 'sell']),
      amount: z.number(),
    }),
  },
  handler: async (req, { body, user }) => {
    const { type, amount } = body

    const isSell = type === 'sell'
    let address = ''

    if (isSell) {
      if (!user.payment.pix) {
        return sendResponse(400, {
          message:
            'O usuário ainda não escolheu uma chave PIX, favor escolher uma chave PIX para realizar a venda. Precisa estar no mesmo CPF da conta do AdaPix. Peça para ele te mandar pra você cadastrar.',
        })
      }

      address = user.payment.pix
    }

    if (!isSell) {
      if (!user.payment.wallet) {
        return sendResponse(400, {
          message:
            'O usuário precisa cadastrar o endereço da sua wallet. Peça para ele te mandar pra você cadastrar.',
        })
      }

      address = user.payment.wallet
    }

    const transaction =
      await modules.usecases.transaction.createTransaction.execute({
        userId: user.id,
        type,
        amount,
        address,
      })

    const addresses = {
      WITHDRAW: transaction.exchangeAddress,
      DEPOSIT: transaction.paymentAddress,
    }

    return sendResponse(200, {
      data: {
        url:
          process.env.NEXT_PUBLIC_APP_URL +
          '/dapp/transactions/' +
          transaction.id,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          type: transaction.type,

          fromAmount: transaction.fromAmount,
          toAmount: transaction.toAmount,

          fromCurrency: transaction.fromCurrency,
          toCurrency: transaction.toCurrency,

          addressToPay: addresses[transaction.type],
          addressToReceive: transaction.addressToReceive,

          completedAt: transaction.completedAt,
          expiresAt: transaction.expiresAt,
          updatedAt: transaction.updatedAt,
          createdAt: transaction.createdAt,
        },
      },
    })
  },
})
