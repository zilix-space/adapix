import { formatCurrency } from '@/helpers/format-currency'
import { Card, CardContent } from '@design-system/react/components/ui/card'
import { Skeleton } from '@design-system/react/components/ui/skeleton'
import { useCountdown } from '@design-system/react/hooks/use-countdown'
import { useEffect } from 'react'

type TransactionPreviewProps = {
  isLoading: boolean
  onExpires: () => void

  estimate?: {
    toAmount: number
    toCurrency: string
    fromAmount: number
    fromCurrency: string
    toCurrencyPrice: number
    fee: number
  }
}

export function TransactionPreview({
  isLoading,
  estimate,
  onExpires,
}: TransactionPreviewProps) {
  const { seconds: countdown, reset } = useCountdown(60)

  useEffect(() => {
    if (countdown > 0) return
    onExpires()
    reset()
  }, [countdown])

  useEffect(() => {
    reset()
  }, [estimate])

  if (!estimate) {
    return null
  }

  if (estimate && isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-8 w-1/2 mt-1" />

          <div className="space-y-2 mt-4">
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
          </div>

          <Skeleton className="h-5 w-2/3 mt-8" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">
          Você vai receber aproximadamente
        </p>

        <p className="text-lg font-semibold text-card-foreground mt-1">
          ~{formatCurrency(estimate.toAmount, estimate.toCurrency)} por{' '}
          {formatCurrency(estimate.fromAmount, estimate.fromCurrency)}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between mt-4">
            <span className="text-sm text-muted-foreground">Preço da ADA</span>
            <span className="text-sm text-card-foreground">
              {formatCurrency(estimate.toCurrencyPrice || 0, 'BRL')}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Taxa de processamento
            </span>
            <span className="text-sm text-card-foreground">
              {formatCurrency(estimate.fee || 0, 'BRL')}
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Válido por {countdown} segundos.
        </p>
      </CardContent>
    </Card>
  )
}
