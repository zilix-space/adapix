import { TransactionStatus } from '@app/modules/src/domain/entities/Transaction'
import axios, { AxiosInstance } from 'axios'
import { IExchangeProvider } from '../../interfaces/providers/exchange'

export class SimpleSwapExchangeProvider implements IExchangeProvider {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.changenow.io/v1',
    })
  }

  async getEstimateForExchange({
    amount,
    from = 'ada',
    to = 'usdttrc20',
  }: {
    amount: number
    from?: string
    to?: string
  }): Promise<{
    inAmount: number
    outAmount: number
    networkFee: number
    transactionSpeedForecast: string
    warningMessage: any
    rateId: string
    validUntil: string
  }> {
    try {
      const response = await axios.get(
        `https://api.changenow.io/v1/exchange-amount/fixed-rate/${amount}/${from}_${to}`,
        {
          params: {
            useRateId: true,
            api_key: process.env.SIMPLESWAP_API_KEY,
          },
        },
      )

      return {
        inAmount: Number(amount),
        outAmount: Number(response.data.estimatedAmount),
        networkFee: response.data.networkFee,
        transactionSpeedForecast: response.data.transactionSpeedForecast,
        warningMessage: response.data.warningMessage,
        rateId: response.data.rateId,
        validUntil: response.data.validUntil,
      }
    } catch (error: any) {
      throw new Error(error.response.data.error)
    }
  }

  async createExchange({
    addressRecipient,
    amount,
    from = 'ada',
    to = 'usdttrc20',
    rateId,
  }: {
    rateId: string
    addressRecipient: string
    amount: number
    from?: string
    to?: string
  }): Promise<{
    id: string
    exchangeAddress: string
    fromAmount: number
    toAmount: number
  }> {
    try {
      const { data } = await axios.post(
        `https://api.changenow.io/v1/transactions/fixed-rate/${process.env.SIMPLESWAP_API_KEY}`,
        {
          from,
          to,
          address: addressRecipient,
          amount,
          rateId,
        },
      )

      return {
        id: data.id,
        exchangeAddress: data.payinAddress,
        fromAmount: Number(amount),
        toAmount: Number(data.amount),
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message)
      throw new Error('Error creating exchange')
    }
  }

  async getExchange(id: string): Promise<{
    id: string
    status: TransactionStatus
    createdAt: Date
    updatedAt: Date
  }> {
    const { data } = await this.api.get(
      `https://api.changenow.io/v1/transactions/${id}/${process.env.SIMPLESWAP_API_KEY}`,
    )

    const simpleSwapStatus: any = {
      new: 'PENDING_DEPOSIT',
      waiting: 'PENDING_DEPOSIT',
      confirming: 'PENDING_DEPOSIT',
      exchanging: 'PENDING_EXCHANGE',
      sending: 'PENDING_PAYMENT',
      finished: 'COMPLETED',
      expired: 'EXPIRED',
    }

    return {
      id: data.id,
      status: simpleSwapStatus[data.status],
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  }
}
