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

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Page() {
  return (
    <div className="flex flex-col space-y-6 h-full">
      <header className="bg-secondary -mx-6 -mt-6 px-6 py-6 space-y-8 border-b border-border">
        <div className="flex items-center justify-between">
          <DynamicUserNav />
          <HeaderToolbar />
        </div>
        <DynamicWalletSummary />{' '}
      </header>
      <main className="space-y-8 h-full flex-grow">
        <DynamicTransactionForm />
        <WalletTransactionList />
      </main>
    </div>
  )
}
