'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../helpers/cn'

const textarea = cva(
  'flex w-full bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: [
          'bg-gray-100 rounded-md dark:bg-slate-800 border-transparent px-4 py-3',
        ],
        outline: [
          'border',
          'border-input',
          'dark:border-slate-700',
          'shadow-lg',
          'px-4 py-4',
        ],
        transparent: [
          'border-none',
          '!bg-transparent',
          'px-0 py-0',
          'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent',
        ],
      },
    },
    defaultVariants: { variant: 'transparent' },
  },
)

type BaseTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

type TextareaProps = VariantProps<typeof textarea> &
  BaseTextareaProps & {
    autoResize?: boolean
  }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, autoResize = true, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const { current: textareaElement } = textareaRef

        textareaElement.style.height = 'auto'
        textareaElement.style.height = `${textareaElement.scrollHeight}px`

        const resizeObserver = new ResizeObserver(() => {
          textareaElement.style.height = 'auto'
          textareaElement.style.height = `${textareaElement.scrollHeight}px`
        })

        resizeObserver.observe(textareaElement)

        return () => {
          resizeObserver.unobserve(textareaElement)
        }
      }
    }, [autoResize, props.value])

    return (
      <textarea
        ref={textareaRef}
        className={cn(textarea({ ...props, className }))}
        placeholder={placeholder}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
