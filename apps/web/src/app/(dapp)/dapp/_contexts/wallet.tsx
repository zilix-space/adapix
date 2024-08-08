'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { toast } from '@design-system/react/components/ui/use-toast'
import { BrowserWallet, Transaction } from '@meshsdk/core'
import { useWallet as useMeshWallet } from '@meshsdk/react'
import { useLocalStorageState } from '@design-system/react/hooks/use-local-storage-state'

type UserWallet = {
  name: string
  address: string
  balance: number
}

export interface WalletContextProps {
  current: UserWallet | null
  installed: {
    name: string
    provider: string
    icon: string
  }[]
  connect: (provider: string, noToast?: boolean) => Promise<void>
  disconnect: () => Promise<void>
  startTransaction: (address: string, amount: number) => Promise<void>
  validateTransaction: (amount: number) => Promise<boolean>
}

export const WalletContext = createContext<WalletContextProps | undefined>(
  undefined,
)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const mesh = useMeshWallet()

  const [preferredWallet, setPreferredWallet] = useLocalStorageState<
    string | null
  >('x-prefered-wallet', null)
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null)

  const handleConnect = async (provider: string, noToast?: boolean) => {
    await mesh.connect(provider)
    setPreferredWallet(provider)

    if (!noToast) {
      toast({
        title: `Sua carteira "${provider}" foi conectada com sucesso`,
      })
    }
  }

  const handleDisconnect = async () => {
    mesh.disconnect()
    setPreferredWallet(null)

    toast({
      title: `Sua carteira foi desconectada com sucesso`,
    })
  }

  const handleUpdateWallet = async () => {
    try {
      if (!mesh.wallet) return

      const balance = await mesh.wallet.getLovelace()
      const addresses = await mesh.wallet.getUsedAddresses()

      setUserWallet({
        name: mesh.name,
        address: addresses[0],
        balance: Number(balance) / 1000000,
      })
    } catch (error) {
      console.error(error)
      setUserWallet(null)
    }
  }

  const handleValidateTransaction = async (amount: number) => {
    return userWallet?.balance >= amount
  }

  const handleStartTransaction = async (address: string, amount: number) => {
    try {
      const tx = new Transaction({ initiator: mesh.wallet }).sendLovelace(
        address,
        (amount * 1000000).toString(),
      )

      const unsignedTx = await tx.build()
      const signedTx = await mesh.wallet.signTx(unsignedTx)
      const txHash = await mesh.wallet.submitTx(signedTx)

      console.log({ txHash })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!mesh.connected) return
    handleUpdateWallet()
  }, [mesh.wallet])

  useEffect(() => {
    if (!preferredWallet || mesh.connected) return
    handleConnect(preferredWallet, true)
  }, [preferredWallet])

  return (
    <WalletContext.Provider
      value={{
        current: userWallet,
        installed: BrowserWallet.getInstalledWallets(),
        connect: handleConnect,
        disconnect: handleDisconnect,
        startTransaction: handleStartTransaction,
        validateTransaction: handleValidateTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
