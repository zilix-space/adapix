import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../helpers/cn'

const input = cva(
  'flex w-full rounded-md bg-transparent text-black dark:text-white ring-offset-background placeholder:text-black/40 dark:placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
      variant: {
        solid: ['bg-black/5 dark:bg-white/5 border border-border px-4 py-3'],
        outline: [
          'bg-transparent',
          'border',
          'border-input',
          'shadow-sm',
          'px-4 py-3',
        ],
        transparent: [
          'border-transparent',
          'bg-transparent',
          '!h-fit px-0',
          'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent',
        ],
      },
    },
    defaultVariants: { size: 'default', variant: 'transparent' },
  },
)

type BaseInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

export type InputProps = VariantProps<typeof input> &
  BaseInputProps & {
    className?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    mask?: string // Adicione a prop "mask" aqui.
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, leftIcon, rightIcon, mask, ...props }, ref) => {
    className = cn(
      [Boolean(leftIcon) && '!pl-6', Boolean(rightIcon) && '!pr-6'],
      className,
      input({ ...props, className, size }),
    )

    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center text-black/40 dark:text-white/40 [&>svg]:w-3 [&>svg]:h-3">
            {leftIcon}
          </span>
        )}

       
          <input {...props} ref={ref} className={className} />

        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center text-black/40 dark:text-white/40 [&>svg]:w-3 [&>svg]:h-3">
            {rightIcon}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
