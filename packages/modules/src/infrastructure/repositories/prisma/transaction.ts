import { PrismaClient } from '@prisma/client'
import { Transaction } from '../../../domain/entities/Transaction'
import { ITransactionRepository } from '../../../interfaces/repositories/transaction'

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const createdTransaction = await this.prisma.transaction.create({
      data: {
        ...transaction,
        status: 'PENDING_DEPOSIT',
      },
    })

    return createdTransaction as Transaction
  }

  async update(
    transactionId: string,
    updates: Partial<Transaction>,
  ): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: updates,
    })

    return updatedTransaction as Transaction
  }

  async getById(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    return transaction as Transaction | null
  }

  async list(userId?: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return transactions as Transaction[]
  }
}
