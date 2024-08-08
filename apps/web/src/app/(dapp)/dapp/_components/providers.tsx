'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import { Skeleton } from '@design-system/react/components/ui/skeleton'

const DynamicMeshProvider = dynamic(
  () => import('@meshsdk/react').then((mod) => mod.MeshProvider),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col space-y-6 h-full">
        <header className="bg-secondary -mx-6 -mt-6 px-6 py-6 space-y-8 border-b border-border">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </header>
        <main className="space-y-8 h-full flex-grow">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col w-full space-y-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="space-y-6 border-t border-border -mx-6 px-6 py-6">
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </main>
      </div>
    ),
  },
)

const DynamicWalletProvider = dynamic(
  () => import('../_contexts/wallet').then((mod) => mod.WalletProvider),
  {
    ssr: false,
  },
)

export function DappProvider({ children }: { children: React.ReactNode }) {
  return (
    <DynamicMeshProvider>
      <DynamicWalletProvider>{children}</DynamicWalletProvider>
    </DynamicMeshProvider>
  )
}
