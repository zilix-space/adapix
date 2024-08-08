import { PropsWithChildren } from 'react'
import { cn } from '../../../helpers/cn'

export function DashboardPage(
  props: PropsWithChildren<{
    className?: string
  }>,
) {
  const { className, children } = props
  return (
    <div
      className={cn(
        'md:h-screen flex flex-col animate-fade-up animate-delay-300 animate-once animate-ease-in-out',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DashboardPageHeader(
  props: PropsWithChildren<{
    className?: string
  }>,
) {
  const { className, children } = props
  return (
    <header
      className={cn([
        'border-b border-border min-h-[69px] flex items-center justify-between px-8',
        className,
      ])}
    >
      {children}
    </header>
  )
}

export function DashboardPageHeaderTitle(
  props: PropsWithChildren<{
    className?: string
  }>,
) {
  const { className, children } = props
  return <h1 className={cn(['opacity-60 text-md md:text-sm', className])}>{children}</h1>
}

export function DashboardPageHeaderActions(
  props: PropsWithChildren<{
    className?: string
  }>,
) {
  const { className, children } = props
  return (
    <div className={cn(['flex items-center !space-x-4', className])}>
      {children}
    </div>
  )
}

export function DashboardPageMain(
  props: PropsWithChildren<{
    className?: string
  }>,
) {
  const { className, children } = props
  return (
    <main
      className={cn(['p-8 pt-6 h-[calc(100vh_-_69px)] overflow-y-auto pb-32 md:pb-8', className])}
    >
      {children}
    </main>
  )
}
