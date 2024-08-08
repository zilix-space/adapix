'use client'

import Link from 'next/link'

import { useApplication } from '@/app/app/_hooks/application.hook'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import { Button } from '@design-system/react/components/ui/button'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DollarSignIcon,
  HelpCircle,
  HelpCircleIcon,
  UserIcon,
  Wallet2Icon,
} from 'lucide-react'
import { getInitialsFromName } from '@design-system/react/helpers/get-initials-from-name'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@design-system/react/components/ui/drawer'
import { useDisclosure } from '@design-system/react/hooks/use-disclosure'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { APP_CONFIGS } from '@/boilerplate.config'
import { User } from '@app/modules/src/domain/entities/User'
import { useWallet } from '../../_hooks/use-wallet'
import { Badge } from '@design-system/react/components/ui/badge'
import { signOut } from 'next-auth/react'

export default function HeaderUserNav() {
  const [isWalletSwitchOpen, setIsWalletSwitchOpen] = useState(false)

  const pathname = usePathname()
  const ref = useRef<HTMLButtonElement>(null)
  const disclousure = useDisclosure()
  const application = useApplication()

  const handleToogleWalletSwitch = () => {
    setIsWalletSwitchOpen((prev) => !prev)
  }

  useEffect(() => {
    disclousure.onClose()
  }, [pathname])

  useEffect(() => {
    if (disclousure.isOpen) {
      setIsWalletSwitchOpen(false)
    }
  }, [disclousure.isOpen])

  if (!application.session.user)
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/5"
        asChild
      >
        <Link href={APP_CONFIGS.app.links.support} target="_blank">
          <HelpCircleIcon className="w-4 h-4" />
        </Link>
      </Button>
    )

  return (
    <Drawer open={disclousure.isOpen} onOpenChange={disclousure.onToggle}>
      <DrawerTrigger asChild>
        <Button variant="link" className="space-x-2" ref={ref}>
          <Avatar className="rounded-full">
            <AvatarImage
              src={application.session.user.image}
              alt={`@${application.session.user.username}`}
            />
            <AvatarFallback className="bg-black/5">
              {getInitialsFromName(application.session.user.name)}
            </AvatarFallback>
          </Avatar>

          <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {!isWalletSwitchOpen && (
          <UserNav
            user={application.session.user}
            onToggleWalletSwitch={handleToogleWalletSwitch}
          />
        )}

        {isWalletSwitchOpen && (
          <WalletSwitch
            user={application.session.user}
            onToggleWalletSwitch={handleToogleWalletSwitch}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}

function UserNav({
  user,
  onToggleWalletSwitch,
}: {
  user: User
  onToggleWalletSwitch: () => void
}) {
  const { current } = useWallet()

  return (
    <div className="mx-auto w-full max-w-sm pb-8">
      <DrawerHeader className="flex flex-col items-start">
        <DrawerTitle>{user.name}</DrawerTitle>
        <DrawerDescription>{user.email}</DrawerDescription>
      </DrawerHeader>

      <div className="grid gap-4">
        <Button variant="ghost" asChild>
          <Link href="/dapp/settings/my-account">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 mr-2" />
              Minha conta
            </div>

            <ChevronRightIcon className="w-4 h-4 ml-auto" />
          </Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link href="/dapp/settings/update-pix">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Minha chave PIX
            </div>

            <ChevronRightIcon className="w-4 h-4 ml-auto" />
          </Link>
        </Button>

        <Button variant="ghost" onClick={onToggleWalletSwitch}>
          <div className="flex items-center space-x-2">
            <Wallet2Icon className="h-4 w-4 mr-2" />
            {current?.name &&
              `Conectado com ${current.name.toLocaleUpperCase()}`}
            {!current?.name && 'Conectar minha carteira'}
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-muted-foreground">Alterar</span>
            <ChevronRightIcon className="w-4 h-4" />
          </div>
        </Button>

        <Button variant="ghost" asChild>
          <Link href={APP_CONFIGS.app.links.support} target="_blank">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 mr-2" />
              Central de ajuda
            </div>

            <ChevronRightIcon className="w-4 h-4 ml-auto" />
          </Link>
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="rounded-full mt-6"
          onClick={() => signOut()}
        >
          Sair da minha conta
        </Button>
      </div>
    </div>
  )
}

function WalletSwitch({
  onToggleWalletSwitch,
}: {
  user: User
  onToggleWalletSwitch: () => void
}) {
  const { current, connect, installed } = useWallet()

  const handleConnectWallet = (walletName: string) => {
    connect(walletName)
    onToggleWalletSwitch()
  }

  return (
    <div className="mx-auto w-full max-w-sm pb-8">
      <DrawerHeader className="flex flex-col items-start">
        <DrawerTitle>Alterar Wallet</DrawerTitle>
        <DrawerDescription>
          Selecione a sua nova wallet para continuar
        </DrawerDescription>
      </DrawerHeader>
      <main className="w-full">
        {installed.map((installedWallet) => (
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
              {installedWallet.name === current?.name && (
                <Badge variant="outline">Conectada</Badge>
              )}
              <ChevronRightIcon className="w-4 h-4 ml-auto" />
            </div>
          </Button>
        ))}
      </main>
    </div>
  )
}
