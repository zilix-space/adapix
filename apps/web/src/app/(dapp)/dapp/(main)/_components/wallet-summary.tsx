'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { Button } from '@design-system/react/components/ui/button'
import { useWallet } from '../../_hooks/use-wallet'
import { formatCurrency } from '@/helpers/format-currency'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@design-system/react/components/ui/drawer'
import { useRef } from 'react'
import { Badge } from '@design-system/react/components/ui/badge'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@design-system/react/helpers/cn'

export default function WalletSummary() {
  const wallet = useWallet()
  const application = useApplication()

  if (!application.session.user) return null

  const userFirstName =
    application.session.user.name?.split(' ')[0] ||
    application.session.user.username

  if (!wallet.current) {
    return (
      <section className="space-y-8">
        <div>
          <h2 className="font-bold leading-none">Olá, {userFirstName}</h2>
          <ChangeWalletButton />
        </div>
      </section>
    )
  }

  return (
    <div>
      <h2 className="font-bold">Olá, {userFirstName}</h2>
      <div className="flex items-center !space-x-2">
        <span className={cn('text-md text-muted-foreground')}>
          ({wallet.current.name}){' '}
          {formatCurrency(wallet.current.balance, 'ADA')}
        </span>
        <ChangeWalletButton />
      </div>
    </div>
  )
}

function ChangeWalletButton() {
  const wallet = useWallet()
  const ref = useRef<HTMLButtonElement>(null)

  const handleConnectWallet = (walletName: string) => {
    wallet.connect(walletName)
    ref.current?.click()
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button ref={ref} variant="link" className="!h-fit text-md">
          {wallet.current?.name ? 'Alterar carteira' : 'Conectar carteira'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader className="flex flex-col items-start">
            <DrawerTitle>Alterar Wallet</DrawerTitle>
            <DrawerDescription>
              Selecione a sua nova wallet para continuar
            </DrawerDescription>
          </DrawerHeader>
          <main className="w-full">
            {wallet.installed.map((installedWallet) => (
              <Button
                variant="ghost"
                className="w-full justify-between"
                key={installedWallet.name}
                onClick={() => handleConnectWallet(installedWallet.name)}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={installedWallet.icon}
                    alt={installedWallet.name}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="capitalize">{installedWallet.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {installedWallet.name === wallet.current?.name && (
                    <Badge variant="outline">Conectada</Badge>
                  )}

                  <ChevronRightIcon className="w-4 h-4 ml-auto" />
                </div>
              </Button>
            ))}
          </main>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
