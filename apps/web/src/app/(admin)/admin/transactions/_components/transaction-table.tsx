'use client'

import { DataTable } from '../../_components/data-display/data-table'
import { columns, Transaction } from './columns'

/**
 * TransactionTable component props
 */
interface TransactionTableProps {
  transactions: Transaction[]
}

/**
 * TransactionTable component that displays transactions in a table
 */
export function TransactionTable({ transactions }: TransactionTableProps) {
  return <DataTable columns={columns} data={transactions} />
}
