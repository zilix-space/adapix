'use client'

import QRCode from 'react-qr-code'

import { differenceInSeconds } from 'date-fns'
import { Transaction } from '@app/modules/src/domain/entities/Transaction'
import { Property } from '@design-system/react/components/ui/property'
import { useCountdown } from '@design-system/react/hooks/use-countdown'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@design-system/react/components/ui/card'
import { ArrowLeftIcon, CheckIcon, ClockIcon, Loader2Icon } from 'lucide-react'
import { formatCurrency } from '@/helpers/format-currency'
import { transactionSteps } from '../_data/steps'
import { cn } from '@design-system/react/helpers/cn'
import { CopyButton } from '@design-system/react/components/ui/copy-button'
import {
  DappPageHeader,
  DappPageHeaderContainer,
  DappPageHeaderSubtitle,
  DappPageHeaderTitle,
} from '@/app/(dapp)/dapp/_components/dapp-page'

export function WaitingPaymentStep({
  transaction,
}: {
  transaction: Transaction
}) {
  return (
    <div className="flex flex-col justify-between h-full space-y-8">
      <DappPageHeader>
        <a href="/dapp">
          <ArrowLeftIcon className="w-4 h-4" />
        </a>

        <DappPageHeaderContainer>
          <DappPageHeaderTitle>
            {transaction.type === 'DEPOSIT' && 'Compra de ADA'}
            {transaction.type === 'WITHDRAW' && 'Venda de ADA'}
          </DappPageHeaderTitle>
          <DappPageHeaderSubtitle>
            {formatCurrency(transaction.toAmount, transaction.toCurrency)} (
            {formatCurrency(transaction.fromAmount, transaction.fromCurrency)})
          </DappPageHeaderSubtitle>
        </DappPageHeaderContainer>
      </DappPageHeader>
      <main className="space-y-8">
        <ExchangeTransferSection transaction={transaction} />
        <ExchangeWaitingForCompletionSection transaction={transaction} />
        <ExchangeCompletedSection transaction={transaction} />
      </main>
      <footer className="space-y-4 border-t border-border py-6 px-6 -mb-6 -mx-6 bg-secondary/40">
        <div className="flex items-start space-x-8">
          {transactionSteps.map((step, index) => {
            const currentIndex = transactionSteps.findIndex(
              (step) => step.name === transaction.status,
            )
            const isCompleted =
              currentIndex > index || transaction.status === 'COMPLETED'
            const isCurrent = step.name === transaction.status

            return (
              <>
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 text-center"
                >
                  {isCurrent && (
                    <div className="flex items-center justify-center w-6 h-6 bg-green-500 border border-green-500 rounded-full">
                      <Loader2Icon className="w-4 h-4 text-white rounded-full animate-spin" />
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex items-center justify-center w-6 h-6 bg-green-500 border border-green-500 rounded-full">
                      <CheckIcon className="w-4 h-4 text-white rounded-full" />
                    </div>
                  )}

                  {!isCurrent && !isCompleted && (
                    <div className="flex items-center justify-center w-6 h-6 border border-border bg-secondary rounded-full"></div>
                  )}

                  <span
                    className={cn(
                      'mt-2 text-sm',
                      isCompleted && 'text-green-500',
                      isCurrent && 'text-green-500',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </>
            )
          })}
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-sm font-normal">
              Resumo do pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Property label="Referência" value={transaction.id} />
            <Property
              label={`Você ${
                transaction.type === 'DEPOSIT' ? 'comprou' : 'vendeu'
              }`}
              value={`${formatCurrency(
                transaction.fromAmount,
                transaction.fromCurrency,
              )} (${formatCurrency(
                transaction.toAmount,
                transaction.toCurrency,
              )})`}
            />

            {transaction.type === 'WITHDRAW' && (
              <Property
                label="Chave PIX"
                value={transaction.addressToReceive}
              />
            )}

            {transaction.type === 'DEPOSIT' && (
              <Property
                label="Wallet"
                value={`${transaction.addressToReceive.slice(
                  0,
                  6,
                )}...${transaction.addressToReceive.slice(-4)}`}
              />
            )}

            <Property
              label="Data de criação"
              value={transaction.createdAt?.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          </CardContent>
        </Card>
      </footer>
    </div>
  )
}

function ExchangeCompletedSection({
  transaction,
}: {
  transaction: Transaction
}) {
  if (transaction.status !== 'COMPLETED') return null

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center justify-center w-10 h-10 border border-border rounded-full">
        <CheckIcon className="w-4 h-4 text-green-500 rounded-full" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-lg font-bold">Concluído!</h1>
        <p className="text-sm text-muted-foreground">
          Você recebeu{' '}
          {formatCurrency(transaction.toAmount, transaction.toCurrency)} por{' '}
          {formatCurrency(transaction.fromAmount, transaction.fromCurrency)}
        </p>
      </div>
    </div>
  )
}

function ExchangeWaitingForCompletionSection({
  transaction,
}: {
  transaction: Transaction
}) {
  if (
    transaction.status !== 'PENDING_PAYMENT' &&
    transaction.status !== 'PENDING_EXCHANGE'
  )
    return null

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center justify-center w-10 h-10 border border-border rounded-full">
        <Loader2Icon className="w-4 h-4 text-blue-500 rounded-full animate-spin" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div>
          <div className="text-center text-lg font-bold">
            <h1>Seus fundos estao a caminho!</h1>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Essa transação pode levar até 10 minutos. Enviaremos uma notificação
            via email quando estiver concluída.
          </p>
        </div>
      </div>
    </div>
  )
}

function ExchangeTransferSection({
  transaction,
}: {
  transaction: Transaction
}) {
  const secondsToExpire = differenceInSeconds(
    new Date(transaction.expiresAt as Date),
    new Date(),
  )
  const countdown = useCountdown(secondsToExpire)

  if (transaction.status !== 'PENDING_DEPOSIT') return null

  if (countdown.minutes === 0 && countdown.seconds === 0) {
    return <div>Expirada</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-center text-lg font-bold">
          <h1>Depósito Pendente</h1>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Por favor, realize o envio do valor requerido para a venda através da
          sua wallet Cardano.
        </p>
      </div>

      <section className="w-full">
        <header>
          <span className="text-sm font-normal">Transfira</span>
        </header>
        <main>
          <div className="w-full p-4 bg-secondary rounded-md flex items-center justify-between gap-2 border border-border">
            <span className="text-sm text-gray-600 line-clamp-1">
              {formatCurrency(transaction.fromAmount, transaction.fromCurrency)}
            </span>
            <CopyButton value={transaction.fromAmount} />
          </div>
        </main>
      </section>

      <section className="w-full">
        <header>
          <span className="text-sm font-normal">Para</span>
        </header>
        <main>
          <div className="w-full p-4 bg-secondary rounded-md  gap-2 border border-border">
            {transaction.type === 'DEPOSIT' && (
              <QRCode
                className="mb-2 rounded-md border border-border p-2"
                size={256}
                style={{
                  height: 'auto',
                  maxWidth: '100%',
                  width: '100%',
                }}
                viewBox={`0 0 256 256`}
                value={transaction.paymentAddress}
              />
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 line-clamp-1">
                {transaction.type === 'DEPOSIT'
                  ? transaction.paymentAddress
                  : transaction.exchangeAddress}
              </span>
              <CopyButton
                value={
                  transaction.type === 'DEPOSIT'
                    ? transaction.paymentAddress
                    : transaction.exchangeAddress
                }
              />
            </div>
          </div>
        </main>
      </section>

      <div className="flex flex-col items-center justify-center gap-2">
        <span className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <ClockIcon className="w-4 h-4" /> Tempo para você depositar acaba em:
        </span>
        <span>
          {countdown.minutes} minutos e {countdown.seconds}s.
        </span>
      </div>
    </div>
  )
}
