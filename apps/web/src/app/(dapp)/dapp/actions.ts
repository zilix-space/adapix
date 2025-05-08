'use server'

import TransactionStarted from '@/emails/transaction-created'

import { client } from '@/services/actions/public-client'
import {
  createTransactionActionSchema,
  estimateTransactionActionSchema,
} from './schemas'
import { modules } from '@app/modules/src'
import { z } from 'zod'
import { formatCurrency } from '@/helpers/format-currency'
import { APP_CONFIGS } from '@/boilerplate.config'
import { renderAsync } from '@react-email/components'
import { mapApiError, formatErrorMessage } from '@/utils/error-mappers'
import { normalizeAmount } from '@/utils/transaction-utils'

export const createTransactionAction = client.action({
  name: 'transaction.create',
  type: 'mutate',
  schema: createTransactionActionSchema,
  handler: async ({ input, context }) => {
    const valueNumber = normalizeAmount(input.amount || '0')

    if (input.type === 'pay' && !input.address) {
      throw new Error('Address is required for pay transactions')
    }

    if (input.type === 'pay') {
      input.type = 'buy'
    }

    // Verificar limites máximos definidos por variáveis de ambiente
    const limits = {
      buy: Number(process.env.NEXT_PUBLIC_TRANSACTION_LIMIT_BUY) || 200,
      sell: Number(process.env.NEXT_PUBLIC_TRANSACTION_LIMIT_SELL) || 100,
    }

    if (valueNumber > limits[input.type]) {
      throw new Error(
        `Valor máximo para ${input.type} é de ${formatCurrency(
          limits[input.type as 'buy' | 'sell'],
          'BRL',
        )}`,
      )
    }

    const address = {
      buy: input.address || context.user.settings.payment.wallet,
      sell: input.address || context.user.settings.payment.wallet,
    }

    try {
      const transaction =
        await modules.usecases.transaction.createTransaction.execute({
          type: input.type,
          amount: valueNumber,
          address: address[input.type],
          userId: context.user.id,
        })

      await modules.provider.mail.send({
        from: APP_CONFIGS.providers.mail.resend.from,
        to: context.user.email,
        subject: `Transação iniciada - ID: ${transaction.id}`,
        body: await renderAsync(
          TransactionStarted({
            email: context.user.email,
            name: context.user.name,
            transaction,
          }),
        ),
      })

      return transaction
    } catch (error) {
      // Mapear e propagar erros usando o sistema de mapeamento
      const mappedError = mapApiError(error as string | Error)
      throw new Error(formatErrorMessage(mappedError))
    }
  },
})

export const estimateTransactionAction = client.action({
  name: 'transaction.estimate',
  type: 'query',
  schema: estimateTransactionActionSchema,
  handler: async ({ input }) => {
    if (!input.amount) return null

    const valueNumber = normalizeAmount(input.amount || '0')

    const limits = {
      buy: Number(process.env.NEXT_PUBLIC_TRANSACTION_LIMIT_BUY) || 250,
      sell: Number(process.env.NEXT_PUBLIC_TRANSACTION_LIMIT_SELL) || 250,
    }

    if (input.type === 'pay') {
      input.type = 'buy'
    }

    if (valueNumber > limits[input.type]) {
      return {
        success: false,
        error: `Valor máximo para ${input.type} é de ${formatCurrency(
          limits[input.type as 'buy' | 'sell'],
          'BRL',
        )}`,
      }
    }

    try {
      const estimate =
        await modules.usecases.transaction.estimateTransaction.execute({
          type: input.type,
          amount: valueNumber,
        })

      return {
        success: true,
        data: estimate,
      }
    } catch (error) {
      // Usar o sistema de mapeamento para gerar erro consistente
      const mappedError = mapApiError(error as string | Error)
      return {
        success: false,
        error: formatErrorMessage(mappedError),
        errorCode: mappedError.code,
        suggestion: mappedError.suggestion,
      }
    }
  },
})

export const getTransactionByIdAction = client.action({
  name: 'transaction.getById',
  type: 'query',
  schema: z.object({
    id: z.string(),
  }),
  handler: async ({ input, context }) => {
    const transaction =
      await modules.usecases.transaction.getTransactionById.execute({
        transactionId: input.id,
      })

    if (transaction.userId !== context.user.id) {
      return null
    }

    return transaction
  },
})

export const listTransactionsAction = client.action({
  name: 'transaction.list',
  type: 'query',
  handler: async ({ context }) => {
    if (!context.user) return []

    return modules.usecases.transaction.listTransactions.execute({
      userId: context.user.id,
    })
  },
})
