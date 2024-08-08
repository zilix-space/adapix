'use client'

import React from 'react'

import type { ReactNode } from 'react'

import Image from 'next/image'
import { cn } from '../../../helpers/cn'
import { Button, ButtonProps } from '../../ui/button'

// DashboardSidebar component
export function DashboardSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="hidden max-w-full md:grid grid-cols-[auto_1fr] gap-4">
      {children}
    </aside>
  )
}

export function DashboardSidebarToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="w-20 relative bg-secondary/20 z-10 border-r page-transition border-border flex flex-col items-center justify-between py-4 animate-fade-up animate-delay-75 animate-once animate-ease-in-out">
      {children}
    </div>
  )
}

export function DashboardSidebarToolbarHeader({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col justify-center h-10 mb-9">{children}</div>
  )
}

export function DashboardSidebarMenu({ children }: { children: ReactNode }) {
  return (
    <div className="w-64 border-r z-0  page-transition border-border py-4 pr-4 flex flex-col justify-between animate-fade-up animate-delay-150 animate-once animate-ease-in-out">
      {children}
    </div>
  )
}

export function DashboardSidebarToolbarMenu({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col items-center space-y-2 flex-1">
      {children}
    </div>
  )
}

export function DashboardSidebarToolbarMenuItem({
  src,
  variant,
  children,
  isActive,
}: {
  src?: string
  variant?: ButtonProps['variant']
  isActive?: boolean
  children: ReactNode
} & ButtonProps) {
  return (
    <Button
      size="icon"
      variant={variant ?? 'outline'}
      className={cn([
        'overflow-hidden',
        isActive && 'bg-secondary',
        src && '!p-0',
      ])}
    >
      {src ? (
        <Image
          alt="Logo"
          className="rounded-md w-full h-full"
          src={src}
          width={32}
          height={32}
        />
      ) : (
        children
      )}
    </Button>
  )
}

export function DashboardSidebarToolbarActions({
  children,
}: {
  children: ReactNode
}) {
  return (
    <aside className="flex flex-col items-center space-y-2">{children}</aside>
  )
}

export function DashboardSidebarToolbarActionsItem({
  icon,
}: {
  icon: React.ReactElement
}) {
  return (
    <Button size="icon" variant="ghost">
      {React.cloneElement(icon, {
        className: `w-5 h-5`,
      })}
    </Button>
  )
}

// DashboardSidebarHeader component
export function DashboardSidebarHeader({ children }: { children: ReactNode }) {
  return (
    <header className="px-4 mb-9 flex items-center justify-between h-10">
      {children}
    </header>
  )
}

export function DashboardSidebarTitle({ children }: { children: ReactNode }) {
  return <strong className="text-md">{children}</strong>
}

export function DashboardSidebarHeaderMenu({
  children,
}: {
  children: ReactNode
}) {
  return <div className="flex items-center space-x-2">{children}</div>
}

// DashboardSidebarMain component
export function DashboardSidebarMain({ children, className }: { children: ReactNode, className?: string }) {
  return <main className={cn("mb-5 flex-1", className)}>{children}</main>
}

// DashboardSidebarLink component
export function DashboardSidebarLink({
  children,
  icon,
  isActive,
  className
}: {
  children: React.ReactNode
  icon: React.ReactElement
  isActive?: boolean
  className?: string
}) {
  return (
    <Button
      className={cn([`w-full justify-start mb-2`, isActive && 'bg-secondary', className])}
      variant="ghost"
    >
      {React.cloneElement(icon, {
        className: `w-4 h-4 mr-2`,
      })}

      {children}
    </Button>
  )
}

// DashboardSidebarFooter component
export function DashboardSidebarFooter({ children }: { children: ReactNode }) {
  return (
    <footer>
      <section>{children}</section>
    </footer>
  )
}
