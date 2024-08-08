import { ITransactionRepository } from '../../../interfaces/repositories/transaction'
import { Transaction } from '../../entities/Transaction'

export class ListTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute({ userId }: { userId?: string }): Promise<Transaction[]> {
    return this.transactionRepository.list(userId)
  }
}
