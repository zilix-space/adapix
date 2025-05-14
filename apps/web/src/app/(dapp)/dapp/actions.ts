'use server'

import TransactionStarted from '@/emails/transaction-created'

import { client } from '@/services/actions/public-client'
import {
  createTransactionActionSchema,
  estimateTransactionActionSchema,
} from './schemas'
import { modules } from '@app/modules/src'
import { z } from 'zod'
import { APP_CONFIGS } from '@/boilerplate.config'
import { renderAsync } from '@react-email/components'
import { mapApiError, formatErrorMessage } from '@/utils/error-mappers'
import { normalizeAmount } from '@/utils/transaction-utils'
import { getPixKeyData } from '@/utils/pix-util'

export const createTransactionAction = client.action({
  name: 'transaction.create',
  type: 'mutate',
  schema: createTransactionActionSchema,
  handler: async ({ input, context }) => {
    const valueNumber = normalizeAmount(input.amount || '0')

    if (input.type === 'pay' && !input.address) {
      throw new Error('Address is required for pay transactions')
    }

    // Validar limites antes de prosseguir
    const limits = await getTransactionLimits({
      from: input.type === 'buy' ? 'BRL' : 'ADA',
      to: input.type === 'buy' ? 'ADA' : 'BRL',
    })

    if (valueNumber < limits.min) {
      throw new Error(
        `Amount is below minimum limit of ${limits.min} ${limits.fromCurrency} (${limits.minInFiat} ${limits.toCurrency})`,
      )
    }

    if (limits.max && valueNumber > limits.max) {
      throw new Error(
        `Amount is above maximum limit of ${limits.max} ${limits.fromCurrency} (${limits.maxInFiat} ${limits.toCurrency})`,
      )
    }

    try {
      const transaction =
        await modules.usecases.transaction.createTransaction.execute({
          type: input.type,
          amount: valueNumber,
          address: input.address || context.user.settings.payment.wallet,
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

    // Validar limites antes de prosseguir
    const limits = await getTransactionLimits({
      from: input.type === 'buy' ? 'BRL' : 'ADA',
      to: input.type === 'buy' ? 'ADA' : 'BRL',
    })

    if (valueNumber < limits.min) {
      return {
        success: false,
        error: `Amount is below minimum limit of ${limits.min} ${limits.fromCurrency}`,
        errorCode: 'AMOUNT_BELOW_MIN',
        suggestion: `Minimum amount allowed is ${limits.min} ${limits.fromCurrency} (${limits.minInFiat} ${limits.toCurrency})`,
      }
    }

    if (limits.max && valueNumber > limits.max) {
      return {
        success: false,
        error: `Amount is above maximum limit of ${limits.max} ${limits.fromCurrency}`,
        errorCode: 'AMOUNT_ABOVE_MAX',
        suggestion: `Maximum amount allowed is ${limits.max} ${limits.fromCurrency} (${limits.maxInFiat} ${limits.toCurrency})`,
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
        data: {
          ...estimate,
          pix:
            input.address &&
            input.type === 'pay' &&
            (await getPixKeyData(input.address)),
        },
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

export const getTransactionLimits = client.action({
  name: 'get.transaction.limit',
  type: 'query',
  schema: z.object({
    from: z.enum(['BRL', 'ADA']),
    to: z.enum(['BRL', 'ADA']),
  }),
  handler: async ({ input }) => {
    try {
      const adaPrice = await modules.provider.market.getQuote('cardano', 'brl')

      if (input.from === 'ADA' && input.to === 'BRL') {
        // ADA -> BRL (venda/sell ou pagamento/pay)
        // Obter limites de ADA para USDT do SimpleSwap
        const exchangeRanges =
          await modules.provider.exchange.getExchangeRanges({
            fixed: true,
            from: 'ada',
            to: 'usdttrc20',
            networkFrom: 'mainnet',
            networkTo: 'mainnet',
          })

        // Converter os valores de string para número
        const minAda = Number(exchangeRanges.min)
        const maxAda = exchangeRanges.max
          ? Number(exchangeRanges.max)
          : Infinity

        // Estimar o valor em BRL para o mínimo de ADA
        const exchangeEstimate =
          await modules.provider.exchange.getEstimateForExchange({
            amount: minAda,
            from: 'ada',
            to: 'usdttrc20',
          })

        const fiatEstimate = await modules.provider.fiat.getEstimateForExchange(
          {
            type: 'buy',
            amount: exchangeEstimate.outAmount,
          },
        )

        return {
          min: minAda,
          max: maxAda,
          minInFiat: fiatEstimate.sendInFiat,
          maxInFiat: maxAda * adaPrice,
          fromCurrency: 'ADA',
          toCurrency: 'BRL',
          price: adaPrice,
        }
      } else if (input.from === 'BRL' && input.to === 'ADA') {
        // BRL -> ADA (compra/buy)
        // Obter limites de USDT para ADA do SimpleSwap
        const exchangeRanges =
          await modules.provider.exchange.getExchangeRanges({
            fixed: true,
            from: 'usdttrc20',
            to: 'ada',
            networkFrom: 'mainnet',
            networkTo: 'mainnet',
          })

        // Primeiro estimar quanto USDT seria necessário para o mínimo em BRL
        const fiatEstimate = await modules.provider.fiat.getEstimateForExchange(
          {
            type: 'sell',
            amount: Number(exchangeRanges.min),
          },
        )

        // Depois estimar quanto ADA seria obtido com esse USDT
        const exchangeEstimate =
          await modules.provider.exchange.getEstimateForExchange({
            amount: fiatEstimate.sendInCrypto,
            from: 'usdttrc20',
            to: 'ada',
          })

        const maxAda = exchangeRanges.max
          ? Number(exchangeRanges.max)
          : Infinity

        return {
          min: exchangeEstimate.outAmount,
          max: maxAda,
          minInFiat: Number(exchangeRanges.min),
          maxInFiat: maxAda * adaPrice,
          fromCurrency: 'BRL',
          toCurrency: 'ADA',
          price: adaPrice,
        }
      } else {
        throw new Error('Invalid currency pair')
      }
    } catch (error) {
      const mappedError = mapApiError(error as string | Error)
      return {
        success: false,
        error: formatErrorMessage(mappedError),
        errorCode: mappedError.code,
      }
    }
  },
})
