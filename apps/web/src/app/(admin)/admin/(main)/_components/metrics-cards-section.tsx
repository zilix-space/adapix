import {
  StatCard,
  StatCardHeader,
  StatCardTitle,
  StatCardMain,
  StatCardValue,
} from '@design-system/react/components/shared/dashboard/stat-card'
import {
  Users,
  ShieldCheck,
  AlertCircle,
  Wallet,
  CircleDollarSign,
  Clock,
} from 'lucide-react'
import { getMetricsAction } from '../actions'
import { formatCurrency } from '../../_utils/format'

/**
 * MetricsCardsSection component that displays KPIs using StatCard
 */
export async function MetricsCardsSection() {
  const metrics = await getMetricsAction()

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-lg border">
      <StatCard className="rounded-none shadow-none border-none bg-secondary/20">
        <StatCardHeader>
          <StatCardTitle>Total Users</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{metrics.totalUsers}</StatCardValue>
          <Users className="h-4 w-4 text-muted-foreground" />
        </StatCardMain>
      </StatCard>

      <StatCard className="rounded-none shadow-none border-none bg-secondary/20">
        <StatCardHeader>
          <StatCardTitle>Approved KYC</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{metrics.approvedKycUsers}</StatCardValue>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </StatCardMain>
      </StatCard>

      <StatCard className="rounded-none shadow-none border-none border-b">
        <StatCardHeader>
          <StatCardTitle>Pending KYC</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{metrics.pendingKycUsers}</StatCardValue>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </StatCardMain>
      </StatCard>

      <StatCard className="rounded-none shadow-none border-none">
        <StatCardHeader>
          <StatCardTitle>24h Volume (BRL)</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>
            {formatCurrency(metrics.last24hVolumes.brl, 'BRL')}
          </StatCardValue>
          <CircleDollarSign className="h-4 w-4 text-green-500" />
        </StatCardMain>
      </StatCard>

      <StatCard className="rounded-none shadow-none border-none">
        <StatCardHeader>
          <StatCardTitle>24h Volume (ADA)</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>
            {formatCurrency(metrics.last24hVolumes.ada, 'ADA')}
          </StatCardValue>
          <Wallet className="h-4 w-4 text-blue-500" />
        </StatCardMain>
      </StatCard>

      <StatCard className="rounded-none shadow-none border-none">
        <StatCardHeader>
          <StatCardTitle>Pending Transactions</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{metrics.pendingTransactions}</StatCardValue>
          <Clock className="h-4 w-4 text-yellow-500" />
        </StatCardMain>
      </StatCard>
    </div>
  )
}
