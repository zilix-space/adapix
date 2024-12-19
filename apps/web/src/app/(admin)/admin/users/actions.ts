'use server'

import { db } from '@app/db'
import type { User } from '../_types'
import { z } from 'zod'
import { modules } from '@app/modules/src'
import KycError from '@/emails/kyc-error'
import KycSuccess from '@/emails/kyc-success'
import { APP_CONFIGS } from '@/boilerplate.config'
import { renderAsync } from '@react-email/components'
import { kycUpdateSchema } from './schemas'
import { client } from '@/services/actions/admin-client'

/**
 * Get all users from the database with filters
 */
export const getUsers = client.action({
  name: 'getUsers',
  type: 'query',
  schema: z.object({
    search: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
  }),
  handler: async ({ input }) => {
    const users = await db.user.findMany({
      where: {
        AND: [
          // Search filter
          input.search
            ? {
                OR: [
                  { name: { contains: input.search, mode: 'insensitive' } },
                  { email: { contains: input.search, mode: 'insensitive' } },
                ],
              }
            : {},
          // Role filter
          input.role ? { role: input.role as any } : {},
          // KYC status filter
          input.status
            ? {
                settings: {
                  path: ['kyc', 'status'],
                  equals: input.status,
                },
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        settings: true,
      },
    })

    return {
      users,
    } as unknown as { users: User[] }
  },
})

/**
 * Get user by ID from the database
 */
export const getUserById = client.action({
  name: 'getUserById',
  type: 'query',
  schema: z.object({
    id: z.string(),
  }),
  handler: async ({ input }) => {
    const user = await db.user.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        settings: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      user,
    } as unknown as { user: User }
  },
})

/**
 * Get user transactions and stats
 */
export const getUserTransactions = client.action({
  name: 'getUserTransactions',
  type: 'query',
  schema: z.object({
    userId: z.string(),
  }),
  handler: async ({ input }) => {
    // Get all user transactions
    const transactions = await db.transaction.findMany({
      where: {
        userId: input.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
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

    // Calculate stats
    const stats = {
      totalTransactions: transactions.length,
      totalDeposited: transactions
        .filter((tx) => tx.type === 'DEPOSIT' && tx.status === 'COMPLETED')
        .reduce((acc, tx) => acc + tx.fromAmount, 0),
      totalWithdrawn: transactions
        .filter((tx) => tx.type === 'WITHDRAW' && tx.status === 'COMPLETED')
        .reduce((acc, tx) => acc + tx.fromAmount, 0),
      pendingTransactions: transactions.filter(
        (tx) =>
          tx.status === 'PENDING_DEPOSIT' ||
          tx.status === 'PENDING_EXCHANGE' ||
          tx.status === 'PENDING_PAYMENT',
      ).length,
    }

    return {
      transactions,
      stats,
    }
  },
})

/**
 * Approve user KYC
 */
export const sendKYCUpdateAction = client.action({
  name: 'sendKYCUpdateAction',
  type: 'mutate',
  schema: kycUpdateSchema,
  handler: async ({ input }) => {
    const { userId, status, reasons } = input

    const user = await modules.usecases.user.getUserById.execute(userId)

    if (!user) {
      return {
        status: 'error',
        message: 'User not found',
      }
    }

    await modules.usecases.user.updateUser.execute(userId, {
      status: status === 'approved' ? 'ACTIVE' : 'PENDING',
      settings: {
        kyc: {
          status,
          reasons,
        },
      },
    })

    if (status === 'approved') {
      await modules.provider.mail.send({
        from: APP_CONFIGS.providers.mail.resend.from,
        to: user.email,
        subject: `Documentos validados com sucesso - ${APP_CONFIGS.app.name}`,
        body: await renderAsync(
          KycSuccess({ email: user.email, name: user.name }),
        ),
      })
    }

    if (status === 'rejected') {
      await modules.provider.mail.send({
        from: APP_CONFIGS.providers.mail.resend.from,
        to: user.email,
        subject: `Documentos inválidos - ${APP_CONFIGS.app.name}`,
        body: await renderAsync(
          KycError({
            email: user.email,
            name: user.name,
            reasons,
          }),
        ),
      })
    }

    return {
      status: 'success',
      message: 'KYC status updated successfully',
    }
  },
})
