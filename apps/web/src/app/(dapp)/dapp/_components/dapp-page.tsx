import { cn } from '@design-system/react/helpers/cn'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

type Props<T = any> = {
  className?: string
  children?: React.ReactNode
} & T

export function DappPage({ className, children }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col h-full w-full space-y-8 animate-fade-up animate-delay-300 animate-once animate-ease-in-out',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DappPageHeader({ className, children }: Props) {
  return (
    <div className={cn('relative items-center', className)}>{children}</div>
  )
}

export function DappPageHeaderBackButton({
  className,
  href,
}: Props<{
  href: string
}>) {
  return (
    <Link href={href} className={cn('absolute', className)}>
      <ChevronLeftIcon className="w-4 h-4" />
    </Link>
  )
}

export function DappPageHeaderContainer({ className, children }: Props) {
  return (
    <div
      className={cn(
        'text-center flex flex-col items-center justify-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DappPageHeaderTitle({ className, children }: Props) {
  return <h1 className={cn('font-bold', className)}>{children}</h1>
}

export function DappPageHeaderSubtitle({ className, children }: Props) {
  return <p className={cn('text-muted-foreground', className)}>{children}</p>
}

export function DappPageMain({ className, children }: Props) {
  return <div className={cn('w-full', className)}>{children}</div>
}

export function DappPageFooter({ className, children }: Props) {
  return <div className={cn('w-full', className)}>{children}</div>
}
