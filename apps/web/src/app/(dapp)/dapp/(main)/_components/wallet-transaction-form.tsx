'use client'

import Link from 'next/link'

import {
  createTransactionAction,
  estimateTransactionAction,
} from '../../actions'
import { createTransactionActionSchema } from '../../schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { CurrencyInput } from '@design-system/react/components/ui/currency-input'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { useAction, useActionForm } from '@/services/actions/lib/client'
import { useEffect, useState } from 'react'
import { TransactionPreview } from './transaction-preview'
import { useRouter } from 'next/navigation'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react'
import { cn } from '@design-system/react/helpers/cn'
import { useWallet } from '../../_hooks/use-wallet'
import { useApplication } from '@/hooks/use-application'

export default function WalletTransactionForm() {
  const [transactionType, setTransactionType] = useState<'sell' | 'buy'>('buy')

  const router = useRouter()
  const application = useApplication()
  const wallet = useWallet()
  const estimate = useAction(estimateTransactionAction)

  const form = useActionForm({
    action: createTransactionAction,
    schema: createTransactionActionSchema,
    reValidateMode: 'onChange',
    defaultValues: {
      type: 'buy',
      address: wallet.current?.address,
    },
    onSubmitSuccess: async (result) => {
      if (result.type === 'WITHDRAW') {
        await wallet.startTransaction(result.exchangeAddress, result.fromAmount)
      }

      router.push(`/dapp/transactions/${result.id}`)
    },
    onSubmitError: (error) => {
      console.error(error)
    },
  })

  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      estimate.execute({
        type: value.type,
        amount: value.amount?.replace(/\D/g, '') || '0',
      })

      if (name === 'type') {
        setTransactionType(value.type as 'sell' | 'buy')
        form.setValue('amount', '')
        form.setValue('address', wallet.current?.address)
      }

      if (name === 'amount') {
        const amount = Number(value.amount?.replace(/\D/g, '') || '0') / 100
        console.log({
          amount,
          walletBalance: wallet.current?.balance,
        })

        const validate = {
          walletBalance: wallet.current?.balance,
          buy: {
            min: 60,
            max: 200,
          },
          sell: {
            min: 30,
            max: 100,
          },
        }

        const errorMessages = {
          buy: 'O valor mínimo para a compra é de R$ 60,00',
          buyMax: 'O valor máximo para a compra é de R$ 200,00',
          sellMin: 'O valor mínimo para a venda é de ₳ 30.000000',
          sellMax: 'O valor máximo para a venda é de ₳ 100.000000',
          notBalance:
            'Você não possui saldo suficiente para comprar esse valor',
        }

        if (value.type === 'buy') {
          if (amount === 0) {
            form.clearErrors('amount')
          } else if (amount < validate.buy.min) {
            form.setError('amount', {
              message: errorMessages.buy,
            })
          } else if (amount > validate.buy.max) {
            form.setError('amount', {
              message: errorMessages.buyMax,
            })
          } else {
            form.clearErrors('amount')
          }
        }

        if (value.type === 'sell') {
          const isValid = await wallet.validateTransaction(amount)

          if (amount === 0) {
            form.clearErrors('amount')
          } else if (amount < validate.sell.min) {
            form.setError('amount', {
              message: errorMessages.sellMin,
            })
          } else if (amount > validate.sell.max) {
            form.setError('amount', {
              message: errorMessages.sellMax,
            })
          } else if (isValid) {
            form.setError('amount', {
              message: errorMessages.notBalance,
            })
          } else {
            form.clearErrors('amount')
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  useEffect(() => {
    form.setValue('address', wallet.current?.address)
  }, [wallet.current?.address])

  const texts = {
    buy: {
      amountPlaceholder: '~ R$ 282,80',
      addressPlaceholder: 'Endereço da wallet',
    },
    sell: {
      amountPlaceholder: '~ ₳ 100.000000',
      addressPlaceholder: 'Sua chave PIX',
    },
  }

  return (
    <Form
      {...form}
      className={cn([
        'grid grid-rows-[1fr_auto] space-y-4',
        !application.session.user && 'h-full',
      ])}
    >
      <main className="space-y-4">
        <div className="grid grid-cols-[3fr_1fr] gap-4 items-center">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem variant="unstyled" className="space-y-0">
                <FormLabel>Digite o valor</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder={texts[transactionType].amountPlaceholder}
                    currency={transactionType === 'buy' ? 'BRL' : 'ADA'}
                    locale="pt-BR"
                    variant="lined"
                    className="text-xl font-semibold leading-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <div className="!space-x-4 flex items-center">
                  <button
                    type="button"
                    className="text-center flex flex-col items-center justify-center"
                    onClick={() => {
                      field.onChange('buy')
                    }}
                  >
                    <span
                      className={cn([
                        'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                        field.value === 'buy' && 'bg-primary text-white',
                      ])}
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </span>
                    <small className="font-semibold mt-1">Comprar</small>
                  </button>
                  <button
                    type="button"
                    className="text-center flex flex-col items-center justify-center"
                    onClick={() => {
                      field.onChange('sell')
                    }}
                  >
                    <span
                      className={cn([
                        'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                        field.value === 'sell' && 'bg-primary text-white',
                      ])}
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </span>
                    <small className="font-semibold mt-1">Vender</small>
                  </button>
                </div>
              </FormItem>
            )}
          />
        </div>

        <TransactionPreview
          isLoading={estimate.isSubmitting}
          estimate={estimate.response}
          onExpires={() => {
            estimate.execute({
              type: form.getValues('type'),
              amount: form.getValues('amount'),
            })
          }}
        />
      </main>

      <footer className="mt-auto">
        {application.session.user && (
          <Button
            className="w-full h-14 rounded-md"
            disabled={
              form.actionState.isSubmitting ||
              !wallet.current?.address ||
              !estimate.response ||
              estimate.response.fromAmount === 0
            }
          >
            {wallet.current?.address ? 'Continuar' : 'Conecte sua carteira'}
            <ButtonIcon
              className="w-4 h-4 ml-auto"
              isLoading={form.actionState.isSubmitting}
              icon={ArrowRightIcon}
            />
          </Button>
        )}

        {!application.session.user && (
          <Button
            className="w-full h-14 rounded-md"
            disabled={form.actionState.isSubmitting}
            asChild
          >
            <Link href="/dapp/auth">
              Entrar para continuar
              <ArrowRightIcon className="w-4 h-4 ml-auto" />
            </Link>
          </Button>
        )}
      </footer>
    </Form>
  )
}
