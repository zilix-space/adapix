import { createApiHandler, sendResponse } from '@/services/http/lib'
import { db } from '@app/db'
import { startOfToday, startOfWeek, startOfMonth, startOfYear } from 'date-fns'

export const revalidate = 0

export const GET = createApiHandler({
  handler: async () => {
    const totalUsers = await db.user.count()
    const approvedUsers = await db.user.count({ where: { status: 'ACTIVE' } })
    const pendingUsers = await db.user.count({ where: { status: 'PENDING' } })
    const rejectedUsers = await db.user.count({ where: { status: 'BLOCKED' } })

    const totalTransactions = await db.transaction.count()
    const totalSaledAda = await db.transaction.aggregate({
      _sum: { fromAmount: true },
      where: { fromCurrency: 'ADA', status: 'COMPLETED' },
    })
    const totalBoughtAda = await db.transaction.aggregate({
      _sum: { toAmount: true },
      where: { toCurrency: 'ADA', status: 'COMPLETED' },
    })

    const today = new Date()
    const startOfTodayDate = startOfToday()
    const startOfWeekDate = startOfWeek(today)
    const startOfMonthDate = startOfMonth(today)
    const startOfYearDate = startOfYear(today)

    const usersTimeframe = {
      today: await db.user.count({
        where: { createdAt: { gte: startOfTodayDate } },
      }),
      thisWeek: await db.user.count({
        where: { createdAt: { gte: startOfWeekDate } },
      }),
      thisMonth: await db.user.count({
        where: { createdAt: { gte: startOfMonthDate } },
      }),
      thisYear: await db.user.count({
        where: { createdAt: { gte: startOfYearDate } },
      }),
    }

    const transactionsTimeframe = {
      today: await db.transaction.count({
        where: { createdAt: { gte: startOfTodayDate }, status: 'COMPLETED' },
      }),
      thisWeek: await db.transaction.count({
        where: { createdAt: { gte: startOfWeekDate }, status: 'COMPLETED' },
      }),
      thisMonth: await db.transaction.count({
        where: { createdAt: { gte: startOfMonthDate }, status: 'COMPLETED' },
      }),
      thisYear: await db.transaction.count({
        where: { createdAt: { gte: startOfYearDate }, status: 'COMPLETED' },
      }),
    }

    return sendResponse(200, {
      users: {
        total: totalUsers,
        approved: approvedUsers,
        pending: pendingUsers,
        rejected: rejectedUsers,
        timeframe: usersTimeframe,
      },
      transactions: {
        total: totalTransactions,
        totalSaledAda: totalSaledAda._sum.fromAmount || 0,
        totalBoughtAda: totalBoughtAda._sum.toAmount || 0,
        timeframe: transactionsTimeframe,
      },
    })
  },
})
