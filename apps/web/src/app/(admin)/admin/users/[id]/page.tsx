import Link from 'next/link'

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { Button } from '@design-system/react/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@design-system/react/components/ui/card'
import { getUserById, getUserTransactions } from '../actions'
import { ArrowLeft } from 'lucide-react'
import { UserStats } from './_components/user-stats'
import { DataTable } from '../../_components/data-display/data-table'
import { columns } from './_components/columns'
import { UserBaseInfoSection } from './_components/user-base-info-section'

/**
 * User details page props
 */
interface UserDetailsPageProps {
  params: {
    id: string
  }
}

/**
 * User details page component
 */
export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const { user } = await getUserById({ id: params.id })
  const { transactions, stats } = await getUserTransactions({
    userId: params.id,
  })

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <DashboardPageHeaderTitle>User Details</DashboardPageHeaderTitle>
        </div>
      </DashboardPageHeader>

      <DashboardPageMain className="px-0 space-y-6">
        <UserBaseInfoSection user={user} />

        <div className="px-6 space-y-6">
          <UserStats {...stats} />

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="!px-0 !pb-0">
              <DataTable columns={columns} data={transactions as any[]} />
            </CardContent>
          </Card>
        </div>
      </DashboardPageMain>
    </DashboardPage>
  )
}