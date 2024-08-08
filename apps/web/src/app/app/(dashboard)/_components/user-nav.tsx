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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@design-system/react/components/ui/dropdown-menu'
import {
  CreditCard,
  ExternalLink,
  LogOut,
  PlusCircle,
  User,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { getInitialsFromName } from '@design-system/react/helpers/get-initials-from-name'

export function UserNav() {
  const { session } = useApplication()
  const { dict } = useDictionary()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="space-x-4">
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarImage
              src={session.user.image}
              alt={`@${session.user.username}`}
            />
            <AvatarFallback>
              {getInitialsFromName(session.user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-1 text-left">
            <p className="text-xs font-medium leading-none line-clamp-1">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground line-clamp-1">
              {session.user.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/app/settings">
              <User className="h-3 w-3 mr-2" />
              {dict.dashboard.sidebar.sections.userNav.items.profile}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/app/settings/billing">
              <CreditCard className="h-3 w-3 mr-2" />
              {dict.dashboard.sidebar.sections.userNav.items.billing}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/app/get-started/create-team">
            <PlusCircle className="h-3 w-3 mr-2" />
            {dict.dashboard.sidebar.sections.userNav.items.createTeam}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">
            <ExternalLink className="h-3 w-3 mr-2" />
            {dict.dashboard.sidebar.sections.userNav.items.homePage}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="h-3 w-3 mr-2" />
          {dict.dashboard.sidebar.sections.userNav.items.logOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
