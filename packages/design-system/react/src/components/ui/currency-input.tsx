import React from 'react'

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
        solid: ['bg-black/5 dark:bg-background/5 border border-border px-4 py-3'],
        outline: [
          'bg-transparent',
          'border',
          'border-input',
          'shadow-sm',
          'px-4 py-3',
        ],
        lined: [
          'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent',
          'bg-transparent',
          'border-b',
          'border-input',
          'rounded-none',
          'py-3',
          'pl-0',
          'focus-visible:border-primary',
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
    currency?: 'USD' | 'BRL' | 'ADA'
    locale?: 'pt-BR' | 'en-US'
    mask?: string // Adicione a prop "mask" aqui.
  }

const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, leftIcon, rightIcon, mask, value: initialValue = 0, currency = 'BRL', locale = 'pt-BR', ...props }, ref) => {
    className = cn(
      [Boolean(leftIcon) && '!pl-6', Boolean(rightIcon) && '!pr-6'],
      className,
      input({ ...props, className, size }),
    )

    const moneyFormatter = Intl.NumberFormat(locale, {
      currency: currency === 'ADA' ? 'BRL' : currency,
      currencyDisplay: "symbol",
      currencySign: "standard",
      style: 'currency',
      minimumFractionDigits: currency === 'ADA' ? 2 : 2,
      maximumFractionDigits: currency === 'ADA' ? 6 : 2,
    });

    const formatCurrency = (value: number) => {
      let formattedValue = moneyFormatter.format(value).replace(',', '.');
      if (currency === 'ADA') {
        formattedValue = formattedValue.replace('R$', '₳');
      }
      return formattedValue;
    };

    const [value, setValue] = React.useState(() => {
      const digits = String(initialValue).replace(/\D/g, "");
      return formatCurrency(Number(digits) / 100);
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const digits = event.target.value.replace(/\D/g, "");
      const realValue = Number(digits) / 100;
      setValue(formatCurrency(realValue));
    }

    React.useEffect(() => {
      const digits = String(initialValue).replace(/\D/g, "");
      setValue(formatCurrency(Number(digits) / 100));
    }, [initialValue, currency])

    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center text-black/40 dark:text-white/40 [&>svg]:w-3 [&>svg]:h-3">
            {leftIcon}
          </span>
        )}

        <input ref={ref} className={className} value={value} onChange={handleChange} {...props}  />

        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center text-black/40 dark:text-white/40 [&>svg]:w-3 [&>svg]:h-3">
            {rightIcon}
          </span>
        )}
      </div>
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
