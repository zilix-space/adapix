import Link from 'next/link'

import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { listTransactionsAction } from '../../actions'
import { formatCurrency } from '@/helpers/format-currency'
import { cn } from '@design-system/react/helpers/cn'
import { TransactionStatus } from '@app/modules/src/domain/entities/Transaction'
import { getApplicationSession } from '@/services/session/get-application-session'

export async function WalletTransactionList() {
  const session = await getApplicationSession()
  const transactions = await listTransactionsAction()

  if (!session.user) return null

  const statuses: Record<
    TransactionStatus,
    {
      label: string
      className: string
    }
  > = {
    PENDING_DEPOSIT: {
      label: 'Aguardando depósito',
      className: 'bg-orange-500',
    },
    PENDING_EXCHANGE: {
      label: 'Aguardando troca',
      className: 'bg-blue-500',
    },
    PENDING_PAYMENT: {
      label: 'Aguardando pagamento',
      className: 'bg-yellow-500',
    },
    COMPLETED: {
      label: 'Completa',
      className: 'bg-green-500',
    },
    EXPIRED: {
      label: 'Expirada',
      className: 'bg-red-500',
    },
  }

  return (
    <section className="space-y-4 -mx-6 px-6 border-t border-border pt-8">
      <header>
        <h2 className="font-bold">Transações</h2>
      </header>
      <main className="space-y-6">
        {transactions.length === 0 && (
          <span className="text-muted-foreground">
            Nenhuma transação encontrada
          </span>
        )}

        {transactions.map((transaction) => (
          <Link
            key={transaction.id}
            href={`/dapp/transactions/${transaction.id}`}
            className="flex items-start gap-4 justify-between border-b border-border/30 pb-6"
          >
            <span
              className={cn([
                'flex items-center justify-center h-10 w-10 rounded-md',
                transaction.type === 'DEPOSIT' &&
                  'bg-green-50 border-green-200',
                transaction.type === 'WITHDRAW' && 'bg-red-50',
              ])}
            >
              {transaction.type === 'DEPOSIT' && (
                <ArrowUpIcon className="w-4 h-4" />
              )}

              {transaction.type === 'WITHDRAW' && (
                <ArrowDownIcon className="w-4 h-4" />
              )}
            </span>

            <div className="flex flex-col flex-1">
              <strong className="text-sm">
                {transaction.type === 'DEPOSIT' && 'Compra de ADA'}
                {transaction.type === 'WITHDRAW' && 'Venda de ADA'}
              </strong>
              <small className="text-muted-foreground line-clamp-1">
                {formatCurrency(transaction.toAmount, transaction.toCurrency)} (
                {formatCurrency(
                  transaction.fromAmount,
                  transaction.fromCurrency,
                )}
                )
              </small>
            </div>

            <div className="flex flex-col items-end justify-end text-right">
              <small className="text-muted-foreground/60">
                {transaction.createdAt.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
              <div className="flex items-center justify-end w-fit text-muted-foreground text-sm text-right">
                {statuses[transaction.status].label}
                <span
                  className={cn([
                    'w-2 h-2 rounded-full block ml-2',
                    statuses[transaction.status].className,
                  ])}
                />
              </div>
            </div>
          </Link>
        ))}
      </main>
    </section>
  )
}
