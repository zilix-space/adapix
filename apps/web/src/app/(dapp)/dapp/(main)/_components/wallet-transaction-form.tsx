'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CameraIcon,
  QrCodeIcon,
  CheckCircleIcon,
  InfoIcon,
  AlertCircle,
  AlertCircleIcon,
  Loader2,
} from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@design-system/react/components/ui/drawer'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@design-system/react/components/ui/alert'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@design-system/react/components/ui/tooltip'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { CurrencyInput } from '@design-system/react/components/ui/currency-input'
import { useRouter } from 'next/navigation'
import {
  createTransactionAction,
  estimateTransactionAction,
} from '../../actions'
import { createTransactionActionSchema } from '../../schemas'
import { TransactionPreview } from './transaction-preview'
import { QrReader } from 'react-qr-reader'
import { PixDataPreview } from './pix-data-preview'
import { useMediaQuery } from '@/hooks/use-media-query'
import { mapApiError, formatErrorMessage } from '@/utils/error-mappers'
import {
  createEstimateParams,
  normalizeAmount,
} from '@/utils/transaction-utils'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@design-system/react/helpers/cn'
import { useApplication } from '@/hooks/use-application'
import { useWallet } from '../../_hooks/use-wallet'
import { useAction, useActionForm } from '@/services/actions/lib/client'
import { PixQRData, parsePixQR } from '@/helpers/parse-pix-qr'

// Tipos
type TransactionType = 'sell' | 'buy' | 'pay'
type PaymentMethod = 'pix' | 'wallet'

// Componente principal
export default function WalletTransactionForm() {
  // Estado local
  const [transactionType, setTransactionType] = useState<TransactionType>('buy')
  const [payCurrency, setPayCurrency] = useState<PaymentMethod>('pix')
  const [showQrReader, setShowQrReader] = useState(false)
  const [showQrDrawer, setShowQrDrawer] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const [qrSuccess, setQrSuccess] = useState<boolean>(false)
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false)
  const [pixData, setPixData] = useState<PixQRData | null>(null)
  const [isEstimating, setIsEstimating] = useState<boolean>(false)

  // Refs
  const addressInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const isMobile = useMediaQuery('(max-width: 640px)')
  const router = useRouter()
  const application = useApplication()
  const wallet = useWallet()
  const estimate = useAction(estimateTransactionAction)

  // Formulário e validações
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
      console.error('Erro na submissão:', error)
      const mappedError = mapApiError(error)
      form.setError('amount', {
        message: formatErrorMessage(mappedError),
      })
    },
  })

  // Obter valores do formulário e aplicar debounce
  const watchedValues = form.watch()
  const debouncedAmount = useDebounce(watchedValues.amount, 500)
  const debouncedType = useDebounce(watchedValues.type, 300)

  // Efeito para atualizar a carteira
  useEffect(() => {
    form.setValue('address', wallet.current?.address)
  }, [wallet.current?.address])

  // Efeito para processar estimativa de transação quando valores mudam
  useEffect(() => {
    // Somente executar se houver um valor
    const amount = normalizeAmount(debouncedAmount || '0')
    if (amount === 0) return

    const handleEstimate = async () => {
      setIsEstimating(true)
      try {
        const estimateParams = createEstimateParams({
          type: watchedValues.type as TransactionType,
          amount: debouncedAmount || '0',
        })

        const result = await estimate.execute(estimateParams)

        if (!result.success && result.error) {
          form.setError('amount', {
            message: result.error,
            type: 'validate',
          })
        } else {
          form.clearErrors('amount')
        }
      } catch (error) {
        console.error('Erro ao estimar transação:', error)
        const mappedError = mapApiError(error as string | Error)
        form.setError('amount', {
          message: formatErrorMessage(mappedError),
        })
      } finally {
        setIsEstimating(false)
      }
    }

    handleEstimate()
  }, [debouncedAmount, debouncedType])

  // Efeito para transição entre tipos
  useEffect(() => {
    const handleTypeChange = async () => {
      // Limpa o valor para evitar estimativas com valores antigos
      form.setValue('amount', '')

      // Define o endereço para o da carteira atual
      form.setValue('address', wallet.current?.address)
    }

    handleTypeChange()
  }, [watchedValues.type, payCurrency])

  // Efeito para validar saldo da carteira em caso de venda
  useEffect(() => {
    const validateWalletBalance = async () => {
      if (watchedValues.type !== 'sell') return

      const amount = normalizeAmount(watchedValues.amount || '0')
      if (amount === 0) return

      const isValid = await wallet.validateTransaction(amount)

      if (isValid) {
        form.setError('amount', {
          message: 'Sem saldo',
        })
      } else {
        // Só limpa se o erro for de saldo. Mantém outros erros (ex: out_of_range)
        const currentError = form.formState.errors.amount?.message
        if (currentError && currentError.includes('saldo')) {
          form.clearErrors('amount')
        }
      }
    }

    validateWalletBalance()
  }, [watchedValues.amount, watchedValues.type])

  // Manipulador para abertura da câmera QR
  const handleOpenQrReader = async () => {
    try {
      console.log('Solicitando permissão para acessar a câmera...')
      setLoadingCamera(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      if (stream) {
        console.log('Permissão concedida. Abrindo leitor de QR Code.')
        setQrError(null)

        if (isMobile) {
          setShowQrDrawer(true)
        } else {
          setShowQrReader(true)
        }

        // Garantir liberação de recursos de câmera
        const tracks = stream.getTracks()
        if (tracks && tracks.length) {
          tracks.forEach((track) => {
            track.addEventListener('ended', () => {
              console.log('Camera track ended')
            })
          })
        }
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error)
      setQrError(
        'Não foi possível acessar a câmera. Verifique as permissões do navegador.',
      )
    } finally {
      setLoadingCamera(false)
    }
  }

  // Manipulador para processamento de QR code
  const handleQrResult = (result: any) => {
    if (!result) return

    const qrValue = result.getText()
    console.log('QR Code lido com sucesso:', qrValue)

    // Processar QR PIX quando aplicável
    if (payCurrency === 'pix') {
      const parsedPixData = parsePixQR(qrValue)
      if (parsedPixData) {
        console.log('Dados PIX detectados:', parsedPixData)
        setPixData(parsedPixData)

        // Preencher valor se disponível no QR PIX
        if (parsedPixData.value) {
          form.setValue('amount', String(parsedPixData.value * 100))
        }
      }
    }

    // Definir endereço e fechar modal/drawer
    form.setValue('address', qrValue)
    setShowQrReader(false)
    setShowQrDrawer(false)
    setQrSuccess(true)

    // Focar no campo de endereço
    setTimeout(() => {
      addressInputRef.current?.focus()
      setTimeout(() => setQrSuccess(false), 3000)
    }, 100)
  }

  function isValid(): boolean {
    const userWalletAddress = wallet.current?.address

    const transactionEstimate = estimate.response?.data
    const transactionType = form.getValues('type')
    const transactionAddress = form.getValues('address')

    const isSubmitting = form.actionState.isSubmitting
    const isWalletDisconnected = userWalletAddress && transactionType !== 'pay'
    const isEstimateInvalid = !transactionEstimate
    const isFromAmountZero = transactionEstimate?.fromAmount === 0
    const isPayAddressMissing = transactionType === 'pay' && transactionAddress
    const isCurrentlyEstimating = isEstimating
    const hasAmountError = Boolean(form.formState.errors.amount)

    return !!(
      isSubmitting ||
      isWalletDisconnected ||
      isEstimateInvalid ||
      isFromAmountZero ||
      isPayAddressMissing ||
      isCurrentlyEstimating ||
      hasAmountError
    )
  }

  function getTransactionButtonLabel(): string {
    if (transactionType === 'pay') {
      return 'Pagar'
    }

    return 'Continuar'
  }

  // Mapeamento de configurações para cada tipo de transação
  const transactionTypeConfig = {
    buy: {
      amountPlaceholder: '~ R$ 282,80',
      addressPlaceholder: 'Endereço da wallet',
      addressLabel: 'Endereço da wallet',
      icon: <ArrowUpIcon className="w-4 h-4" />,
      buttonText: 'Comprar',
      tooltipText: 'Comprar ADA com BRL',
      currencyDisplay: 'BRL',
    },
    sell: {
      amountPlaceholder: '~ ₳ 100.000000',
      addressPlaceholder: 'Sua chave PIX',
      addressLabel: 'Chave PIX para receber',
      icon: <ArrowDownIcon className="w-4 h-4" />,
      buttonText: 'Vender',
      tooltipText: 'Vender ADA por BRL',
      currencyDisplay: 'ADA',
    },
    pay: {
      amountPlaceholder: 'Valor a pagar',
      addressPlaceholder: 'Chave PIX ou wallet de destino',
      addressLabel: 'Destino (PIX ou wallet)',
      icon: <QrCodeIcon className="w-4 h-4" />,
      buttonText: 'Pagar',
      tooltipText: 'Realizar pagamento',
      currencyDisplay: '',
    },
  }

  // Mapeamento para métodos de pagamento
  const paymentMethodConfig = {
    pix: {
      icon: <CameraIcon className="w-4 h-4 flex-shrink-0" />,
      label: 'Chave PIX',
      addressLabel: 'Chave PIX de destino',
      placeholder: 'Chave PIX',
      scanInstructionText: 'uma chave PIX',
      currency: 'ADA',
    },
    wallet: {
      icon: <QrCodeIcon className="w-4 h-4 flex-shrink-0" />,
      label: 'Carteira ADA',
      addressLabel: 'Wallet de destino',
      placeholder: 'Endereço da wallet',
      scanInstructionText: 'um endereço de wallet',
      currency: 'BRL',
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
        {/* Área de valor e tipo de transação */}
        <div className="grid grid-cols-[3fr_1fr] gap-4 items-center">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem variant="unstyled" className="space-y-0">
                <div className="flex items-center space-x-1 !text-xs">
                  <FormLabel className="m-0">Qual o valor?</FormLabel>
                  {isEstimating && (
                    <Loader2 className="h-4 w-4 text-primary/50 animate-spin" />
                  )}
                </div>
                <FormControl>
                  <CurrencyInput
                    placeholder={
                      transactionType === 'pay'
                        ? payCurrency === 'pix'
                          ? 'Valor em ADA'
                          : 'Valor em R$'
                        : transactionTypeConfig[transactionType]
                            .amountPlaceholder
                    }
                    currency={
                      transactionType === 'pay'
                        ? payCurrency === 'pix'
                          ? 'ADA'
                          : 'BRL'
                        : transactionType === 'buy'
                        ? 'BRL'
                        : 'ADA'
                    }
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-center flex flex-col items-center justify-center"
                          onClick={() => {
                            field.onChange('buy')
                            setTransactionType('buy')
                            form.setValue('amount', '')
                          }}
                        >
                          <span
                            className={cn([
                              'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                              transactionType === 'buy' &&
                                'bg-primary text-white',
                            ])}
                          >
                            {transactionTypeConfig.buy.icon}
                          </span>
                          <small className="font-semibold mt-1">
                            {transactionTypeConfig.buy.buttonText}
                          </small>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{transactionTypeConfig.buy.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-center flex flex-col items-center justify-center"
                          onClick={() => {
                            field.onChange('sell')
                            setTransactionType('sell')
                          }}
                        >
                          <span
                            className={cn([
                              'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                              transactionType === 'sell' &&
                                'bg-primary text-white',
                            ])}
                          >
                            {transactionTypeConfig.sell.icon}
                          </span>
                          <small className="font-semibold mt-1">
                            {transactionTypeConfig.sell.buttonText}
                          </small>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{transactionTypeConfig.sell.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-center flex flex-col items-center justify-center"
                          onClick={() => {
                            field.onChange('pay')
                            setTransactionType('pay')
                            form.setValue('amount', '')
                          }}
                        >
                          <span
                            className={cn([
                              'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                              transactionType === 'pay' &&
                                'bg-primary text-white',
                            ])}
                          >
                            {transactionTypeConfig.pay.icon}
                          </span>
                          <small className="font-semibold mt-1">
                            {transactionTypeConfig.pay.buttonText}
                          </small>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{transactionTypeConfig.pay.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Campo de endereço para modo de pagamento */}
        {transactionType === 'pay' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <InfoIcon className="w-4 h-4 text-primary" />
                Para onde enviar?
              </label>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setPayCurrency('pix')
                    form.setValue('amount', '')
                  }}
                  className={cn([
                    'flex-1 py-2 px-3 rounded-md border font-medium text-sm transition-all duration-200 flex items-center gap-2',
                    payCurrency === 'pix'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-secondary',
                  ])}
                >
                  {paymentMethodConfig.pix.icon}
                  <span>{paymentMethodConfig.pix.label}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayCurrency('wallet')
                    form.setValue('amount', '')
                  }}
                  className={cn([
                    'flex-1 py-2 px-3 rounded-md border font-medium text-sm transition-all duration-200 flex items-center gap-2',
                    payCurrency === 'wallet'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-secondary',
                  ])}
                >
                  {paymentMethodConfig.wallet.icon}
                  <span>{paymentMethodConfig.wallet.label}</span>
                </button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem variant="unstyled" className="space-y-0">
                  <FormLabel>
                    {payCurrency === 'pix'
                      ? 'Chave PIX de destino'
                      : 'Wallet de destino'}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <input
                        ref={addressInputRef}
                        type="text"
                        placeholder={
                          payCurrency === 'pix'
                            ? 'Chave PIX'
                            : 'Endereço da wallet'
                        }
                        className="w-full border rounded-md px-3 py-2"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 px-2 rounded-md"
                        onClick={handleOpenQrReader}
                        title="Ler QR Code"
                        disabled={loadingCamera}
                      >
                        {loadingCamera ? (
                          <CameraIcon className="w-5 h-5 animate-spin" />
                        ) : (
                          <QrCodeIcon className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Modal QR para Desktop */}
                  {showQrReader && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in">
                      <div className="bg-card border border-border shadow-lg rounded-lg p-4 max-w-md w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between w-full mb-3">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            Escanear QR Code
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => setShowQrReader(false)}
                          >
                            &times;
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 w-full">
                          Aponte a câmera para um QR Code válido com{' '}
                          {payCurrency === 'pix'
                            ? 'uma chave PIX'
                            : 'um endereço de wallet'}
                        </p>
                        <div className="w-full aspect-square relative border-2 border-dashed border-primary/30 rounded-lg overflow-hidden mb-3">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-3/4 h-3/4 border-2 border-primary rounded-lg animate-pulse opacity-60"></div>
                          </div>
                          <QrReader
                            constraints={{
                              facingMode: 'environment',
                              aspectRatio: 1,
                              width: { ideal: 1080 },
                              height: { ideal: 1080 },
                            }}
                            onResult={(result, error) => {
                              if (result) {
                                handleQrResult(result)
                              }
                              if (error) {
                                console.error('Erro ao ler QR Code:', error)
                              }
                            }}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                        {qrError && (
                          <div className="text-destructive text-sm mt-2 mb-1 flex items-center gap-2 bg-destructive/10 w-full p-2 rounded-md">
                            <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{qrError}</span>
                          </div>
                        )}
                        <Button
                          className="mt-2 w-full"
                          onClick={() => setShowQrReader(false)}
                          type="button"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Drawer QR para Mobile */}
                  <Drawer open={showQrDrawer} onOpenChange={setShowQrDrawer}>
                    <DrawerContent className="h-[85vh] rounded-t-lg">
                      <DrawerHeader className="border-b pb-2 pt-2">
                        <DrawerTitle className="text-center">
                          Ler QR Code
                        </DrawerTitle>
                      </DrawerHeader>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Aponte a câmera para um QR Code válido com{' '}
                          {payCurrency === 'pix'
                            ? 'uma chave PIX'
                            : 'um endereço de wallet'}
                        </p>
                        <div className="w-full aspect-square relative border-2 border-dashed border-primary/30 rounded-lg overflow-hidden mb-3">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-3/4 h-3/4 border-2 border-primary rounded-lg animate-pulse opacity-60"></div>
                          </div>
                          <QrReader
                            constraints={{
                              facingMode: 'environment',
                              width: { ideal: 1280 },
                              height: { ideal: 720 },
                            }}
                            onResult={(result, error) => {
                              if (result) {
                                handleQrResult(result)
                              }
                              if (error) {
                                console.error('Erro ao ler QR Code:', error)
                              }
                            }}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                        {qrError && (
                          <div className="text-destructive text-sm mt-2 mb-1 flex items-center gap-2 bg-destructive/10 w-full p-2 rounded-md">
                            <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{qrError}</span>
                          </div>
                        )}
                        <Button
                          className="mt-2 w-full"
                          onClick={() => setShowQrDrawer(false)}
                          type="button"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>

                  {/* Confirmação de leitura do QR */}
                  {!showQrReader && qrSuccess && (
                    <div className="text-primary text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>QR Code lido com sucesso!</span>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Exibe detalhes do PIX quando disponíveis */}
            {transactionType === 'pay' && payCurrency === 'pix' && pixData && (
              <div className="mt-3 animate-in fade-in slide-in-from-bottom-1">
                <PixDataPreview pixData={pixData} />
              </div>
            )}
          </div>
        )}

        {/* Alerta de erro para validação out_of_range */}
        {form.formState.errors.amount?.message?.includes('out_of_range') && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-bottom-1"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Valor mínimo não atingido</AlertTitle>
            <AlertDescription>
              {form.formState.errors.amount.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Preview da transação */}
        <TransactionPreview
          isLoading={estimate.isSubmitting}
          estimate={estimate.response?.success ? estimate.response.data : null}
          onExpires={() => {
            estimate.execute({
              type: form.getValues('type'),
              amount: form.getValues('amount'),
            })
          }}
        />
      </main>

      {/* Rodapé com botões de ação */}
      <footer className="mt-auto">
        {application.session.user ? (
          <Button className="w-full h-14 rounded-md" disabled={isValid()}>
            {getTransactionButtonLabel()}
            <ButtonIcon
              className="w-4 h-4 ml-auto"
              isLoading={form.actionState.isSubmitting}
              icon={ArrowRightIcon}
            />
          </Button>
        ) : (
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
