'use client'

import Link from 'next/link'

import * as React from 'react'
import { cn } from '@design-system/react/helpers/cn'
import {
  BarChart,
  ChevronDown,
  ExternalLink,
  Home,
  LogOut,
  Users,
} from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { UserNav } from './user-nav'
import { Logo } from '@/app/_components/logo'
import { Button } from '@design-system/react/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@design-system/react/components/ui/collapsible'

/**
 * Props for the SidebarCollapsibleItem component
 */
interface SidebarCollapsibleItemProps {
  title: string
  href: string
  icon: React.ElementType
  items: {
    title: string
    value: string
  }[]
  paramName: string
}

/**
 * SidebarCollapsibleItem component that displays a collapsible menu item with submenus
 */
function SidebarCollapsibleItem({
  title,
  href,
  icon: Icon,
  items,
  paramName,
}: SidebarCollapsibleItemProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isActive = pathname === href
  const currentParam = searchParams.get(paramName)
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors',
            isActive && 'bg-accent',
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'transform rotate-180',
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-8 mt-1 space-y-1">
          <Link
            href={href}
            className={cn(
              'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors',
              !currentParam && isActive && 'bg-accent',
            )}
          >
            All
          </Link>
          {items.map((item) => (
            <Link
              key={item.value}
              href={`${href}?${paramName}=${item.value}`}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors',
                currentParam === item.value && isActive && 'bg-accent',
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/**
 * Navigation items configuration with submenus
 */
const navigationItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    items: [
      { title: 'Pending', value: 'PENDING' },
      { title: 'Approved', value: 'APPROVED' },
      { title: 'Rejected', value: 'REJECTED' },
    ],
    paramName: 'status',
  },
  {
    title: 'Transactions',
    href: '/admin/transactions',
    icon: BarChart,
    items: [
      { title: 'Pending Deposit', value: 'PENDING_DEPOSIT' },
      { title: 'Pending Exchange', value: 'PENDING_EXCHANGE' },
      { title: 'Pending Payment', value: 'PENDING_PAYMENT' },
      { title: 'Completed', value: 'COMPLETED' },
      { title: 'Expired', value: 'EXPIRED' },
    ],
    paramName: 'status',
  },
]

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  user: {
    name: string
    email: string
    image?: string
  }
}

/**
 * Sidebar component that displays navigation and user information
 */
export function AdminSidebar({ user }: SidebarProps): JSX.Element {
  const pathname = usePathname()

  return (
    <div className="flex flex-col justify-between h-screen border-r">
      <header className="flex justify-between items-center border-b h-[4.3rem] px-4">
        <Logo className="h-7" />
        <Button size="icon" variant="outline">
          <LogOut className="h-4 w-4" />
        </Button>
      </header>
      <main className="space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          if (item.items) {
            return (
              <SidebarCollapsibleItem
                key={item.href}
                title={item.title}
                href={item.href}
                icon={item.icon}
                items={item.items}
                paramName={item.paramName}
              />
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors',
                pathname === item.href && 'bg-accent',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </main>
      <footer className="mt-auto border-t">
        <Link
          href="https://adapix.com.br"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors mx-4 my-2"
        >
          <ExternalLink className="h-4 w-4" />
          Go to AdaPix
        </Link>
        <div className="p-4 pt-1 border-t">
          <UserNav user={user} />
        </div>
      </footer>
    </div>
  )
}
