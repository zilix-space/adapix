import { TransactionStatus } from '../../domain/entities/Transaction'

export type EstimateExchangeParams = {
  amount: number
  from?: string
  to?: string
}

export type EstimateExchangeResult = {
  inAmount: number
  outAmount: number
  networkFee: number
  transactionSpeedForecast: string
  warningMessage: any
  rateId: string
  validUntil: string
}

export type CreateExchangeParams = {
  rateId: string
  addressRecipient: string
  amount: number
  from?: string
  to?: string
}

export type CreateExchangeResult = {
  id: string
  exchangeAddress: string
  fromAmount: number
  toAmount: number
}

export type GetExchangeResult = {
  id: string
  status: TransactionStatus
  createdAt: Date
  updatedAt: Date
}

export interface IExchangeProvider {
  getEstimateForExchange(
    params: EstimateExchangeParams,
  ): Promise<EstimateExchangeResult>
  createExchange(params: CreateExchangeParams): Promise<CreateExchangeResult>
  getExchange(id: string): Promise<GetExchangeResult>
}
