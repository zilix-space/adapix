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
  BlocksIcon,
  ChevronRightIcon,
  CreditCard,
  ExternalLink,
  LogOut,
  PlusCircle,
  SunIcon,
  User,
  UserPlus2Icon,
} from 'lucide-react'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { getInitialsFromName } from '@design-system/react/helpers/get-initials-from-name'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@design-system/react/components/ui/drawer'
import { Separator } from '@design-system/react/components/ui/separator'
import { useDisclosure } from '@design-system/react/hooks/use-disclosure'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

export function UserMobileNav() {
  const pathname = usePathname()
  const ref = useRef<HTMLButtonElement>(null)
  const disclousure = useDisclosure()

  const { session } = useApplication()
  const { dict } = useDictionary()

  useEffect(() => {
    disclousure.onClose()
  }, [pathname])

  return (
    <Drawer open={disclousure.isOpen} onOpenChange={disclousure.onToggle}>
      <DrawerTrigger asChild>
        <Button variant="link" className="space-x-4" ref={ref}>
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarImage
              src={session.user.image}
              alt={`@${session.user.username}`}
            />
            <AvatarFallback>
              {getInitialsFromName(session.user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader className="flex flex-col items-start">
            <DrawerTitle>{session.user.name}</DrawerTitle>
            <DrawerDescription>{session.user.email}</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4">
            <Button variant="ghost" asChild>
              <Link href="/app/settings">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 mr-2" />
                  {dict.dashboard.sidebar.sections.userNav.items.profile}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/app/settings/billing">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {dict.dashboard.sidebar.sections.userNav.items.billing}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/app/settings/members">
                <div className="flex items-center space-x-2">
                  <UserPlus2Icon className="h-4 w-4 mr-2" />
                  {dict.dashboard.settings.members.main.submit.label}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/app/settings/integrations">
                <div className="flex items-center space-x-2">
                  <BlocksIcon className="h-4 w-4 mr-2" />
                  {dict.dashboard.settings.integrations.title}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/app/settings/theme">
                <div className="flex items-center space-x-2">
                  <SunIcon className="h-4 w-4 mr-2" />
                  {dict.dashboard.settings.theme.title}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Separator />

            <Button variant="ghost" asChild>
              <Link href="/app/get-started/create-team">
                <div className="flex items-center space-x-2">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {dict.dashboard.sidebar.sections.userNav.items.createTeam}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Separator />

            <Button variant="ghost" asChild>
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {dict.dashboard.sidebar.sections.userNav.items.homePage}
                </div>

                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              </Link>
            </Button>

            <Button variant="ghost" onClick={() => signOut()}>
              <div className="flex items-center space-x-2">
                <LogOut className="h-4 w-4 mr-2" />
                {dict.dashboard.sidebar.sections.userNav.items.logOut}
              </div>

              <ChevronRightIcon className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
