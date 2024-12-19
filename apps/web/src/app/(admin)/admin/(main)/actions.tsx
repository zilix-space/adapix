'use server'

import { db } from '@app/db'
import type { User } from '../_types'
import type { Transaction } from '../transactions/_components/columns'
import { client } from '@/services/actions/admin-client'

/**
 * Get metrics data from database
 */
export const getMetricsAction = client.action({
  name: 'getMetrics',
  type: 'query',
  handler: async () => {
    const [
      totalUsers,
      approvedKycUsers,
      pendingKycUsers,
      last24hTransactions,
      pendingTransactions,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({
        where: {
          settings: {
            path: ['kyc', 'status'],
            equals: 'approved',
          },
        },
      }),
      db.user.count({
        where: {
          settings: {
            path: ['kyc', 'status'],
            equals: 'pending',
          },
        },
      }),
      db.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.transaction.count({
        where: {
          status: {
            in: ['PENDING_DEPOSIT', 'PENDING_EXCHANGE', 'PENDING_PAYMENT'],
          },
        },
      }),
    ])

    // Calculate 24h volumes
    const last24hVolumes = last24hTransactions.reduce(
      (acc, tx) => {
        if (tx.status === 'COMPLETED') {
          if (tx.type === 'DEPOSIT') {
            acc.brl += tx.fromAmount
            acc.ada += tx.toAmount
          } else {
            acc.ada += tx.fromAmount
            acc.brl += tx.toAmount
          }
        }
        return acc
      },
      { brl: 0, ada: 0 },
    )

    return {
      totalUsers,
      approvedKycUsers,
      pendingKycUsers,
      last24hVolumes,
      pendingTransactions,
    }
  },
})

/**
 * Get latest transactions from database
 */
export const getLatestTransactionsAction = client.action({
  name: 'getLatestTransactions',
  type: 'query',
  handler: async () => {
    const transactions = await db.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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

    return { transactions } as unknown as { transactions: Transaction[] }
  },
})

/**
 * Get latest KYC submissions from database
 */
export const getLatestKYCSubmissionsAction = client.action({
  name: 'getLatestKYCSubmissions',
  type: 'query',
  handler: async () => {
    const submissions = await db.user.findMany({
      where: {
        settings: {
          path: ['kyc', 'status'],
          equals: 'submitted',
        },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        settings: true,
        updatedAt: true,
      },
    })

    return { submissions } as unknown as { submissions: User[] }
  },
})

/**
 * Get latest users from database
 */
export const getLatestUsersAction = client.action({
  name: 'getLatestUsers',
  type: 'query',
  handler: async () => {
    const users = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        settings: true,
        createdAt: true,
      },
    })

    return { users } as unknown as { users: User[] }
  },
})
