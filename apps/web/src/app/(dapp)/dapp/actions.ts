'use server'

import TransactionStarted from '@/emails/transaction-created'

import { client } from '@/services/actions/public-client'
import {
  createTransactionActionSchema,
  estimateTransactionActionSchema,
} from './schemas'
import { modules } from '@app/modules/src'
import { z } from 'zod'
import { indier } from '@/services/indier'
import { formatCurrency } from '@/helpers/format-currency'
import { APP_CONFIGS } from '@/boilerplate.config'
import { renderAsync } from '@react-email/components'

export const createTransactionAction = client.action({
  name: 'transaction.create',
  type: 'mutate',
  schema: createTransactionActionSchema,
  handler: async ({ input, context }) => {
    const isBuy = input.type === 'buy'
    const valueNumber = Number(input.amount.replace(/\D/g, '') || '0') / 100

    const transaction =
      await modules.usecases.transaction.createTransaction.execute({
        type: input.type,
        amount: valueNumber,
        address: isBuy ? input.address : context.user.settings.payment.pix,
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

    await indier.analytics.event.create({
      event: 'transaction-created',
      channel: 'user-journey',
      title: 'New Transaction',
      description: `A new ${input.type} transaction was created by @${context.user.username}`,
      icon: '🚀',
      identity: {
        identityId: '',
        email: context.user.email,
        name: context.user.name,
        phone: context.user.settings.contact.phone,
        image: context.user.image,
      },
      properties: {
        id: transaction.id,
        type: transaction.type,

        from: formatCurrency(transaction.fromAmount, transaction.fromCurrency),
        to: formatCurrency(transaction.toAmount, transaction.toCurrency),

        exchangeId: transaction.exchangeId,
        exchangeAddress: transaction.exchangeAddress,

        paymentId: transaction.paymentId,
        paymentAddress: transaction.paymentAddress,
      },
    })

    return transaction
  },
})

export const estimateTransactionAction = client.action({
  name: 'transaction.estimate',
  type: 'query',
  schema: estimateTransactionActionSchema,
  handler: async ({ input }) => {
    if (!input.amount) return null

    const valueNumber = Number(input.amount.replace(/\D/g, '') || '0') / 100

    const values = {
      buy: {
        min: 60,
        max: 200,
      },
      sell: {
        min: 30,
        max: 100,
      },
    }

    if (valueNumber < values[input.type].min) {
      return null
    }

    return modules.usecases.transaction.estimateTransaction.execute({
      type: input.type,
      amount: valueNumber,
    })
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
