'use client'

import Link from 'next/link'

import {
  MobileMenu,
  MobileMenuButton,
  MobileMenuContent,
} from '@design-system/react/components/shared/dashboard/mobile-menu'
import { HomeIcon, PlugIcon, Settings2Icon } from 'lucide-react'
import { UserMobileNav } from './user-mobile-nav'
import { usePathname } from 'next/navigation'

export function MobileNavMenu() {
  const pathname = usePathname()

  const isActive = (path: string, exact = false) => {
    return exact ? pathname === path : pathname.startsWith(path)
  }

  return (
    <MobileMenu>
      <MobileMenuContent>
        <MobileMenuButton isActive={isActive('/app', true)}>
          <Link href="/app">
            <HomeIcon className="w-6 h-6" />
          </Link>
        </MobileMenuButton>
        <MobileMenuButton isActive={isActive('/app/plugins')}>
          <Link href="/app/plugins">
            <PlugIcon className="w-6 h-6" />
          </Link>
        </MobileMenuButton>
        <MobileMenuButton isActive={isActive('/app/settings')}>
          <Link href="/app/settings">
            <Settings2Icon className="w-6 h-6" />
          </Link>
        </MobileMenuButton>
        <MobileMenuButton>
          <UserMobileNav />
        </MobileMenuButton>
      </MobileMenuContent>
    </MobileMenu>
  )
}
