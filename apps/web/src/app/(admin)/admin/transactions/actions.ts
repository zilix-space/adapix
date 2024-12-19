'use server'

import { db } from '@app/db'
import { z } from 'zod'
import type { Transaction } from './_components/columns'
import { client } from '@/services/actions/admin-client'

/**
 * Get all transactions from the database with filters
 */
export const getTransactions = client.action({
  name: 'getTransactions',
  type: 'query',
  schema: z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
  }),
  handler: async ({ input }) => {
    const transactions = await db.transaction.findMany({
      where: {
        AND: [
          // Search filter
          input.search
            ? {
                OR: [
                  {
                    user: {
                      name: { contains: input.search, mode: 'insensitive' },
                    },
                  },
                  {
                    user: {
                      email: { contains: input.search, mode: 'insensitive' },
                    },
                  },
                ],
              }
            : {},
          // Status filter
          input.status ? { status: input.status as any } : {},
          // Type filter
          input.type ? { type: input.type as any } : {},
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            settings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      transactions,
    } as unknown as { transactions: Transaction[] }
  },
})

/**
 * Get transaction by ID from the database
 */
export const getTransactionById = client.action({
  name: 'getTransactionById',
  type: 'query',
  schema: z.object({
    id: z.string(),
  }),
  handler: async ({ input }) => {
    const transaction = await db.transaction.findUnique({
      where: { id: input.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            settings: true,
          },
        },
      },
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return {
      transaction,
    } as unknown as { transaction: Transaction }
  },
})

/**
 * Update transaction status
 */
export const updateTransactionStatus = client.action({
  name: 'updateTransactionStatus',
  type: 'mutate',
  schema: z.object({
    id: z.string(),
    status: z.enum([
      'PENDING_DEPOSIT',
      'PENDING_EXCHANGE',
      'PENDING_PAYMENT',
      'COMPLETED',
      'EXPIRED',
    ]),
  }),
  handler: async ({ input }) => {
    const transaction = await db.transaction.update({
      where: { id: input.id },
      data: { status: input.status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return {
      transaction,
    } as unknown as { transaction: Transaction }
  },
})
