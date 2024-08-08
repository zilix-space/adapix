import { Transaction, TransactionType } from '../../domain/entities/Transaction'

export interface CreateTransactionDTO {
  userId: string
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
}

export interface ITransactionRepository {
  create(transaction: CreateTransactionDTO): Promise<Transaction>
  update(
    transactionId: string,
    updates: Partial<Transaction>,
  ): Promise<Transaction>
  getById(transactionId: string): Promise<Transaction | null>
  list(userId?: string): Promise<Transaction[]>
}
