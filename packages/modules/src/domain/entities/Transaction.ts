export type TransactionStatus =
  | 'PENDING_DEPOSIT'
  | 'PENDING_EXCHANGE'
  | 'PENDING_PAYMENT'
  | 'COMPLETED'
  | 'EXPIRED'

export type TransactionType = 'DEPOSIT' | 'WITHDRAW'

export interface Transaction {
  id: string
  userId: string

  status: TransactionStatus
  type: TransactionType

  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeId: string
  exchangeAddress: string
  paymentId: string
  paymentAddress: string
  addressToReceive: string

  completedAt?: Date
  expiresAt?: Date
  updatedAt: Date
  createdAt: Date
}
