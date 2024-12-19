import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { DataTable } from '../_components/data-display/data-table'
import { getUsers } from './actions'
import { columns } from './_components/columns'
import { UserFilters } from './_components/user-filters'
import type { Metadata } from 'next'

/**
 * Props for the UsersPage component
 */
interface UsersPageProps {
  searchParams: {
    search?: string
    role?: string
    status?: string
  }
}

/**
 * Users page component that displays a list of users in a data table
 */
export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { users } = await getUsers({
    search: searchParams.search,
    role: searchParams.role,
    status: searchParams.status,
  })

  return (
    <DashboardPage>
      <DashboardPageHeader className="w-full flex">
        <UserFilters defaultSearchParams={searchParams} />
      </DashboardPageHeader>

      <DashboardPageMain className="!p-0">
        <DataTable columns={columns} data={users} />
      </DashboardPageMain>
    </DashboardPage>
  )
}

export const metadata: Metadata = {
  title: 'Users | Admin',
  description:
    'Manage and monitor user accounts, KYC status, and user settings.',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
