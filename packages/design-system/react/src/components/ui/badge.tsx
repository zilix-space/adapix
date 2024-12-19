import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../helpers/cn'

/**
 * Badge component variants using class-variance-authority
 * Provides different visual styles for badges with opaque backgrounds and contrasting text
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-primary/30 bg-primary/10 text-primary-foreground hover:bg-primary/20 dark:border-primary/40 dark:bg-primary/20',
        secondary:
          'border-secondary/30 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 dark:border-secondary/40 dark:bg-secondary/20',
        destructive:
          'border-destructive/30 bg-destructive/10 text-destructive-foreground hover:bg-destructive/20 dark:border-destructive/40 dark:bg-destructive/20 text-destructive',
        outline: 
          'border-border/50 bg-background/50 text-foreground hover:bg-accent/50 dark:border-border/50',
        success: 
          'border-green-600/30 bg-green-100/20 text-green-700 hover:bg-green-100/30 dark:border-green-500/40 dark:bg-green-900/30 dark:text-green-400',
        warning:
          'border-yellow-600/30 bg-yellow-100/20 text-yellow-700 hover:bg-yellow-100/30 dark:border-yellow-500/40 dark:bg-yellow-900/30 dark:text-yellow-400',
        info:
          'border-blue-600/30 bg-blue-100/20 text-blue-700 hover:bg-blue-100/30 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-400',
        muted:
          'border-gray-300/30 bg-gray-100/20 text-gray-700 hover:bg-gray-100/30 dark:border-gray-600/40 dark:bg-gray-800/30 dark:text-gray-300',
        purple:
          'border-purple-600/30 bg-purple-100/20 text-purple-700 hover:bg-purple-100/30 dark:border-purple-500/40 dark:bg-purple-900/30 dark:text-purple-400',
        orange:
          'border-orange-600/30 bg-orange-100/20 text-orange-700 hover:bg-orange-100/30 dark:border-orange-500/40 dark:bg-orange-900/30 dark:text-orange-400',
        pink:
          'border-pink-600/30 bg-pink-100/20 text-pink-700 hover:bg-pink-100/30 dark:border-pink-500/40 dark:bg-pink-900/30 dark:text-pink-400',
        indigo:
          'border-indigo-600/30 bg-indigo-100/20 text-indigo-700 hover:bg-indigo-100/30 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-400'
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
