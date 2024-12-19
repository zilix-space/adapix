'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { StatusBadge } from '../../../_components/data-display/status-badge'
import { formatDate, formatCurrency } from '../../../_utils/format'

/**
 * Transaction interface for the table
 */
interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAW'
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  status:
    | 'PENDING_DEPOSIT'
    | 'PENDING_EXCHANGE'
    | 'PENDING_PAYMENT'
    | 'COMPLETED'
    | 'EXPIRED'
  createdAt: string
}

/**
 * Columns configuration for the transactions table
 */
export const columns: ColumnDef<Transaction, any>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type
      return type === 'DEPOSIT' ? 'Buy' : 'Sell'
    },
  },
  {
    accessorKey: 'fromAmount',
    header: 'From Amount',
    cell: ({ row }) => {
      const tx = row.original
      return formatCurrency(tx.fromAmount, tx.fromCurrency)
    },
  },
  {
    accessorKey: 'toAmount',
    header: 'To Amount',
    cell: ({ row }) => {
      const tx = row.original
      return formatCurrency(tx.toAmount, tx.toCurrency)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.status.toLowerCase() as any}
        type="transaction"
      />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
]
