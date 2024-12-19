import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { MetricsCardsSection } from './_components/metrics-cards-section'
import { LatestTransactions } from './_components/latest-transactions'
import { LatestKYC } from './_components/latest-kyc'
import { LatestUsers } from './_components/latest-users'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@design-system/react/components/ui/tabs'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

/**
 * Metadata for the admin dashboard page
 */
export const metadata: Metadata = {
  title: 'Dashboard | Admin',
  description: 'Monitor and manage all activities in the admin dashboard.',
}

/**
 * Admin dashboard page
 */
export default async function AdminPage() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>Dashboard</DashboardPageHeaderTitle>
      </DashboardPageHeader>

      <DashboardPageMain className="space-y-6">
        {/* KPIs */}
        <MetricsCardsSection />

        {/* Latest Activities */}
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Latest Transactions</TabsTrigger>
            <TabsTrigger value="kyc">Latest KYC</TabsTrigger>
            <TabsTrigger value="users">Latest Users</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <LatestTransactions />
          </TabsContent>
          <TabsContent value="kyc">
            <LatestKYC />
          </TabsContent>
          <TabsContent value="users">
            <LatestUsers />
          </TabsContent>
        </Tabs>
      </DashboardPageMain>
    </DashboardPage>
  )
}
