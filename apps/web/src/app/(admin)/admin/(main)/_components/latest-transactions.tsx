import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@design-system/react/components/ui/card'
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import { getLatestTransactionsAction } from '../actions'
import { formatDate, formatCurrency } from '../../_utils/format'
import { StatusBadge } from '../../_components/data-display/status-badge'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@design-system/react/components/ui/empty-state'
import { TransactionSheet } from '../../transactions/_components/transaction-sheet'

/**
 * LatestTransactions component that displays recent transactions
 */
export async function LatestTransactions() {
  const { transactions } = await getLatestTransactionsAction()

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState>
            <Wallet className="h-8 w-8 text-muted-foreground mb-2" />
            <EmptyStateTitle>No transactions found</EmptyStateTitle>
            <EmptyStateDescription>
              No transactions have been made yet.
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionSheet
                key={transaction.id}
                transaction={transaction}
                user={transaction.user}
              >
                <div className="flex cursor-pointer items-center justify-between p-4 rounded-lg border bg-card transition-colors hover:bg-accent">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      {transaction.type === 'DEPOSIT' ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={transaction.user.image} />
                        <AvatarFallback>
                          {transaction.user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          transaction.fromAmount,
                          transaction.fromCurrency,
                        )}
                      </p>
                      <span className="text-muted-foreground">→</span>
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          transaction.toAmount,
                          transaction.toCurrency,
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        variant={transaction.status.toLowerCase() as any}
                        type="transaction"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </TransactionSheet>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
