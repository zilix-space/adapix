import { PropsWithChildren } from 'react'
import { cn } from '../../helpers/cn'

export const SeparatorWithText = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string
}>) => {
  return (
    <div
      className={cn(
        'w-full flex space-x-1 items-center justify-center mt-4',
        className,
      )}
    >
      <hr className="w-1/3" />
      <div className="w-1/3 no-wrap text-center text-xs uppercase text-zinc-600">
        {children}
      </div>
      <hr className="w-1/3" />
    </div>
  )
}
