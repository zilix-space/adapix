import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@design-system/react/components/ui/drawer'
import { cn } from '@design-system/react/helpers/cn'
import { ChevronRight } from 'lucide-react'

type Props<T = any> = {
  className?: string
  children?: React.ReactNode
} & T

export function CollapsableForm({ children }: Props) {
  return <Drawer>{children}</Drawer>
}

export function CollapsableFormTrigger({ className, children }: Props) {
  return (
    <DrawerTrigger asChild>
      <button
        type="button"
        className={cn(
          'flex items-center justify-between w-full border-b border-border pb-4',
          className,
        )}
      >
        {children}
      </button>
    </DrawerTrigger>
  )
}

export function CollapsableFormTriggerLabel({ className, children }: Props) {
  return <div className={cn('font-bold', className)}>{children}</div>
}

export function CollapsableFormTriggerValue({ className, children }: Props) {
  return (
    <div
      className={cn(
        'flex items-center space-x-4 text-muted-foreground',
        className,
      )}
    >
      {children}
      <ChevronRight className="w-4 h-4 ml-4" />
    </div>
  )
}

export function CollapsableFormContent({ className, children }: Props) {
  return <DrawerContent className={cn('', className)}>{children}</DrawerContent>
}

export function CollapsableFormFooter({ className, children }: Props) {
  return (
    <DrawerFooter
      className={cn(
        'px-6 border-t border-border pt-6 mt-6 bg-secondary/40',
        className,
      )}
    >
      {children}
    </DrawerFooter>
  )
}

export function CollapsableFormMain({ className, children }: Props) {
  return <div className={cn('px-6 space-y-4', className)}>{children}</div>
}

export function CollapsableFormClose({ className, children }: Props) {
  return <DrawerClose className={cn('', className)}>{children}</DrawerClose>
}

export function CollapsableFormHeader({ className, children }: Props) {
  return (
    <DrawerHeader className={cn('justify-start text-left px-6', className)}>
      {children}
    </DrawerHeader>
  )
}

export function CollapsableFormTitle({ className, children }: Props) {
  return <DrawerTitle className={cn('', className)}>{children}</DrawerTitle>
}

export function CollapsableFormDescription({ className, children }: Props) {
  return (
    <DrawerDescription className={cn('', className)}>
      {children}
    </DrawerDescription>
  )
}
