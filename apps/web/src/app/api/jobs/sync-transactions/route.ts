import { db } from '@app/db'
import { modules } from '@app/modules/src'
import { differenceInMinutes } from 'date-fns'

export async function GET() {
  const transactions = await db.transaction.findMany({
    where: {
      status: {
        notIn: ['COMPLETED', 'EXPIRED'],
      },
    },
  })

  for (const { id } of transactions) {
    const transaction =
      await modules.usecases.transaction.getTransactionById.execute({
        transactionId: id,
      })

    if (
      transaction.status === 'PENDING_DEPOSIT' ||
      transaction.status === 'PENDING_PAYMENT'
    ) {
      const difference = differenceInMinutes(new Date(), transaction.createdAt)
      const hasMoreThanSixHours = difference > 360 // 6 hours

      if (!hasMoreThanSixHours) continue

      await db.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: 'EXPIRED',
        },
      })
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Transactions synced',
      data: transactions.length,
    }),
    {
      status: 200,
    },
  )
}
