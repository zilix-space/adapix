'use client'

import {
  StatCard,
  StatCardHeader,
  StatCardTitle,
  StatCardMain,
  StatCardValue,
} from '@design-system/react/components/shared/dashboard/stat-card'
import { formatCurrency } from '../../../_utils/format'
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react'

/**
 * Props for the UserStats component
 */
interface UserStatsProps {
  totalTransactions: number
  totalDeposited: number // in BRL
  totalWithdrawn: number // in ADA
  pendingTransactions: number
}

/**
 * UserStats component that displays user KPIs using StatCard
 */
export function UserStats({
  totalTransactions,
  totalDeposited,
  totalWithdrawn,
  pendingTransactions,
}: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard>
        <StatCardHeader>
          <StatCardTitle>Total Transactions</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{totalTransactions}</StatCardValue>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </StatCardMain>
      </StatCard>

      <StatCard>
        <StatCardHeader>
          <StatCardTitle>Total Deposited</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{formatCurrency(totalDeposited, 'BRL')}</StatCardValue>
          <ArrowDownLeft className="h-4 w-4 text-green-500" />
        </StatCardMain>
      </StatCard>

      <StatCard>
        <StatCardHeader>
          <StatCardTitle>Total Withdrawn</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{formatCurrency(totalWithdrawn, 'ADA')}</StatCardValue>
          <ArrowUpRight className="h-4 w-4 text-red-500" />
        </StatCardMain>
      </StatCard>

      <StatCard>
        <StatCardHeader>
          <StatCardTitle>Pending Transactions</StatCardTitle>
        </StatCardHeader>
        <StatCardMain>
          <StatCardValue>{pendingTransactions}</StatCardValue>
          <Clock className="h-4 w-4 text-yellow-500" />
        </StatCardMain>
      </StatCard>
    </div>
  )
}
