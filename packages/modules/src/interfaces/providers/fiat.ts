export type CreateExchangeParams = {
  type: 'buy' | 'sell'
  address: string
  amount: number
  user: {
    document: string
    email: string
    phone: string
    country: string
    address: {
      zipCode: string
      number: string
      street: string
    }
  }
}

export type GetEstimateExchangeParams = {
  type: 'buy' | 'sell'
  amount: number
}

export type GetEstimateExchangeResult = {
  priceInFiat: number
  totalInFiat: number
  feeInFiat: number
  sendInFiat: number

  amountInCrypto: number
  priceInCrypto: number
  totalInCrypto: number
  sendInCrypto: number

  timeout: number
}

export type CreateExchangeResult = {
  id: string
  address: string
  estimate: {
    priceInFiat: number
    totalInFiat: number
    feeInFiat: number
    sendInFiat: number

    amountInCrypto: number
    priceInCrypto: number
    totalInCrypto: number
    sendInCrypto: number

    timeout: number
  }
}

export interface IFiatProvider {
  getEstimateForExchange(
    params: GetEstimateExchangeParams,
  ): Promise<GetEstimateExchangeResult>
  createExchange(params: CreateExchangeParams): Promise<CreateExchangeResult>
  getExchange(
    id: string,
  ): Promise<{ id: string; status: 'COMPLETED' | 'FAILED' }>
}
