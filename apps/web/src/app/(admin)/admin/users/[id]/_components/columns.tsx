'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowDownLeft,
  ArrowUpRight,
  EyeIcon,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@design-system/react/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@design-system/react/components/ui/dropdown-menu'
import { StatusBadge } from '../../../_components/data-display/status-badge'
import { formatDate, formatCurrency } from '../../../_utils/format'
import { TransactionSheet } from '../../../transactions/_components/transaction-sheet'

/**
 * Transaction interface for the table
 */
export interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAW'
  status:
    | 'PENDING_DEPOSIT'
    | 'PENDING_EXCHANGE'
    | 'PENDING_PAYMENT'
    | 'COMPLETED'
    | 'EXPIRED'
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeId: string
  exchangeAddress: string
  paymentId: string
  paymentAddress: string
  addressToReceive: string
  completedAt?: Date
  expiresAt?: Date
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}

/**
 * Columns configuration for the transactions table
 */
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string

      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-muted">
            {type === 'DEPOSIT' ? (
              <ArrowDownLeft className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-red-500" />
            )}
          </div>
          <span className="font-medium">{type}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'fromAmount',
    header: 'From Amount',
    cell: ({ row }) => {
      const amount = row.getValue('fromAmount') as number
      const currency = row.original.fromCurrency

      return (
        <div className="font-medium">{formatCurrency(amount, currency)}</div>
      )
    },
  },
  {
    accessorKey: 'toAmount',
    header: 'To Amount',
    cell: ({ row }) => {
      const amount = row.getValue('toAmount') as number
      const currency = row.original.toCurrency

      return (
        <div className="font-medium">{formatCurrency(amount, currency)}</div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      return (
        <StatusBadge variant={status.toLowerCase() as any} type="transaction" />
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date

      return (
        <div className="text-sm text-muted-foreground">{formatDate(date)}</div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <div className="flex items-center space-x-4">
          <TransactionSheet transaction={transaction as any}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">View details</span>
              <EyeIcon className="h-4 w-4" />
            </Button>
          </TransactionSheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(transaction.exchangeId)
                }
              >
                Copy exchange ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(transaction.paymentId)
                }
              >
                Copy payment ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
