import { formatCurrency } from '@/helpers/format-currency'
import { PixKeyResponse } from '@/utils/pix-util'
import { Card, CardContent } from '@design-system/react/components/ui/card'
import { Skeleton } from '@design-system/react/components/ui/skeleton'
import { useCountdown } from '@design-system/react/hooks/use-countdown'
import { useEffect } from 'react'

type TransactionPreviewProps = {
  isLoading: boolean
  onExpires: () => void
  pixMode?: boolean
  pixData?: PixKeyResponse

  estimate?: {
    toAmount: number
    toCurrency: string
    fromAmount: number
    fromCurrency: string
    toCurrencyPrice: number
    fee: number
    isFixedOutput?: boolean
  }
}

export function TransactionPreview({
  isLoading,
  estimate,
  onExpires,
  pixData,
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
          {pixData?.data
            ? 'Você vai pagar com sua ADA'
            : estimate.fromCurrency === 'BRL'
            ? 'Você vai receber aproximadamente'
            : 'Você vai receber'}
        </p>

        <p className="text-lg font-semibold text-card-foreground mt-1">
          {pixData?.data
            ? `${formatCurrency(estimate.toAmount, 'BRL')}`
            : `~${formatCurrency(
                estimate.toAmount,
                estimate.toCurrency,
              )} por ${formatCurrency(
                estimate.fromAmount,
                estimate.fromCurrency,
              )}`}
        </p>

        <div className="space-y-2">
          {pixData?.data && (
            <div className="flex justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                ADA necessária
              </span>
              <span className="text-sm text-card-foreground font-medium">
                ~{formatCurrency(estimate.fromAmount || 0, 'ADA')}
              </span>
            </div>
          )}

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

          {pixData?.data && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-sm font-medium block mb-2">
                Detalhes do pagamento PIX:
              </span>
              {pixData?.data.pixKey && (
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Chave</span>
                  <span className="text-sm text-card-foreground font-medium">
                    {pixData?.data.pixKey} ({pixData?.data.pixKeyType})
                  </span>
                </div>
              )}
              {pixData?.data.name && (
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-muted-foreground">
                    Beneficiário
                  </span>
                  <span className="text-sm text-card-foreground font-medium">
                    {pixData?.data.name}
                  </span>
                </div>
              )}
              {pixData?.data.financialInstitutionCode && (
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <span className="text-sm text-card-foreground font-medium">
                    Banco {pixData?.data.financialInstitutionCode} -{' '}
                    {pixData?.data.account} ({pixData?.data.accountType}){' '}
                    {pixData?.data.branch}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-500 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin mr-1 w-3 h-3"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Cotação válida por {countdown} segundos
        </p>
      </CardContent>
    </Card>
  )
}
