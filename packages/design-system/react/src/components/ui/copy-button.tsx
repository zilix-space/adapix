'use client'

import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import { Button, ButtonProps } from './button'
import { cn } from '../../helpers/cn'
import { useClipboard } from '../../hooks/use-clipboard'

type CopyButtonProps = {
  className?: string
  iconClassName?: string
  variant?: ButtonProps['variant']
  value: string | number
}

export function CopyButton({
  className,
  iconClassName,
  value: initialValue,
  variant = 'secondary',
}: CopyButtonProps) {
  const { onCopy, isCopied } = useClipboard(initialValue.toString())

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onCopy}
      className={cn('text-muted-foreground h-8 w-8', className)}
    >
      {isCopied && <CheckIcon className={cn('w-3 h-3', iconClassName)} />}
      {!isCopied && <CopyIcon className={cn('w-3 h-3', iconClassName)} />}
    </Button>
  )
}
