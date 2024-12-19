import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { DataTable } from '../_components/data-display/data-table'
import { getTransactions } from './actions'
import { columns } from './_components/columns'
import { TransactionFilters } from './_components/transaction-filters'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

/**
 * Props for the TransactionsPage component
 */
interface TransactionsPageProps {
  searchParams: {
    search?: string
    status?: string
    type?: string
  }
}

/**
 * Transactions page component that displays a list of transactions in a data table
 */
export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const { transactions } = await getTransactions({
    search: searchParams.search,
    status: searchParams.status,
    type: searchParams.type,
  })

  return (
    <DashboardPage>
      <DashboardPageHeader className="w-full flex">
        <TransactionFilters defaultSearchParams={searchParams} />
      </DashboardPageHeader>

      <DashboardPageMain className="!p-0">
        <DataTable columns={columns} data={transactions} />
      </DashboardPageMain>
    </DashboardPage>
  )
}

export const metadata: Metadata = {
  title: 'Transactions | Admin',
  description:
    'Monitor and manage all transactions, including deposits, withdrawals, and their statuses.',
}
