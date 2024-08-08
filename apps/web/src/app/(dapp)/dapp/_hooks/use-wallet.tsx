import { useContext } from 'react'
import { WalletContext, WalletContextProps } from '../_contexts/wallet'

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
