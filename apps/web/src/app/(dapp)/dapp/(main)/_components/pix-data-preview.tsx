'use client'

import { Card, CardContent } from '@design-system/react/components/ui/card'
import { AlertCircleIcon, CheckCircleIcon, UserIcon, MapPinIcon, KeyIcon, ReceiptIcon } from 'lucide-react'
import { type PixQRData } from '@/helpers/parse-pix-qr'
import { cn } from '@design-system/react/helpers/cn'

interface PixDataPreviewProps {
  pixData: PixQRData | null
  className?: string
}

export function PixDataPreview({ pixData, className }: PixDataPreviewProps) {
  if (!pixData) return null

  return (
    <Card className={cn("border border-border", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold text-base">Dados do PIX</h3>
            <p className="text-muted-foreground text-sm">
              Dados extraídos do QR Code
            </p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Válido</span>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          {pixData.value !== undefined && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Valor</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(pixData.value)}
              </span>
            </div>
          )}

          {pixData.name && (
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{pixData.name}</span>
                {pixData.recipient && pixData.recipient !== pixData.name && (
                  <span className="text-xs text-muted-foreground">{pixData.recipient}</span>
                )}
              </div>
            </div>
          )}

          {pixData.key && (
            <div className="flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Chave PIX</span>
                <span className="text-xs text-muted-foreground break-all">{pixData.key}</span>
              </div>
            </div>
          )}

          {pixData.city && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{pixData.city}</span>
            </div>
          )}

          {pixData.description && (
            <div className="flex items-start gap-2">
              <ReceiptIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Descrição</span>
                <span className="text-xs text-muted-foreground">{pixData.description}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
