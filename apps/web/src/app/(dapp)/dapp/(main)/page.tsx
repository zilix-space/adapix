import React from 'react'
import dynamicComponent from 'next/dynamic'

import { WalletTransactionList } from './_components/wallet-transaction-list'
import { HeaderToolbar } from './_components/header-toolbar'

const DynamicTransactionForm = dynamicComponent(
  async () =>
    import('./_components/wallet-transaction-form').then((mod) => mod.default),
  { ssr: false },
)

const DynamicUserNav = dynamicComponent(
  async () =>
    import('./_components/header-user-nav').then((mod) => mod.default),
  { ssr: false },
)

const DynamicWalletSummary = dynamicComponent(
  async () => import('./_components/wallet-summary').then((mod) => mod.default),
  { ssr: false },
)

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

export default async function Page() {
  return (
    <div className="h-full gap-y-4 grid grid-rows-[auto_1fr]">
      <header className="pb-6 space-y-8 border-b border-border w-full">
        <div className="flex items-center justify-between">
          <DynamicUserNav />
          <HeaderToolbar />
        </div>
        <DynamicWalletSummary />{' '}
      </header>
      <main className="space-y-8 flex-grow">
        <DynamicTransactionForm />
        <WalletTransactionList />
      </main>
    </div>
  )
}
