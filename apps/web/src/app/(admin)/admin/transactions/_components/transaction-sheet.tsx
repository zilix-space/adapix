'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@design-system/react/components/ui/sheet'
import { Button } from '@design-system/react/components/ui/button'
import { StatusBadge } from '../../_components/data-display/status-badge'
import { formatDate, formatCurrency } from '../../_utils/format'
import { Transaction } from './columns'
import { updateTransactionStatus } from '../actions'

/**
 * TransactionSheet component props
 */
interface TransactionSheetProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * TransactionSheet component that displays transaction details in a sheet
 */
export function TransactionSheet({
  transaction,
  open,
  onOpenChange,
}: TransactionSheetProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusUpdate = async (status: string) => {
    try {
      setIsLoading(true)
      await updateTransactionStatus({
        id: transaction.id,
        status: status as any,
      })
      router.refresh()
    } catch (error) {
      console.error('Error updating transaction status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            View and manage transaction information
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Transaction ID</p>
            <p className="text-sm text-muted-foreground">{transaction.id}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Type</p>
            <p className="text-sm text-muted-foreground">{transaction.type}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Status</p>
            <StatusBadge
              variant={transaction.status.toLowerCase() as any}
              type="transaction"
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Amount</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {formatCurrency(
                  transaction.fromAmount,
                  transaction.fromCurrency,
                )}
              </span>
              <span>→</span>
              <span>
                {formatCurrency(transaction.toAmount, transaction.toCurrency)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Exchange Details</p>
            <p className="text-sm text-muted-foreground">
              ID: {transaction.exchangeId}
            </p>
            <p className="text-sm text-muted-foreground">
              Address: {transaction.exchangeAddress}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Payment Details</p>
            <p className="text-sm text-muted-foreground">
              ID: {transaction.paymentId}
            </p>
            <p className="text-sm text-muted-foreground">
              Address: {transaction.paymentAddress}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Receiving Address
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.addressToReceive}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Dates</p>
            <p className="text-sm text-muted-foreground">
              Created: {formatDate(transaction.createdAt)}
            </p>
            {transaction.completedAt && (
              <p className="text-sm text-muted-foreground">
                Completed: {formatDate(transaction.completedAt)}
              </p>
            )}
            {transaction.expiresAt && (
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(transaction.expiresAt)}
              </p>
            )}
          </div>

          {transaction.status !== 'COMPLETED' &&
            transaction.status !== 'EXPIRED' && (
              <div className="space-y-4">
                <p className="text-sm font-medium leading-none">Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleStatusUpdate('COMPLETED')}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleStatusUpdate('EXPIRED')}
                  >
                    Mark as Expired
                  </Button>
                </div>
              </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
