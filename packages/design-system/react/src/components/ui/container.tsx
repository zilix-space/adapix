import React, { PropsWithChildren } from 'react'
import { cn } from '../../helpers/cn'

type ContainerProps = PropsWithChildren<{
  className?: string
}>

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('container max-w-screen-md', className)}>{children}</div>
  )
}
