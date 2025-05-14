'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CameraIcon,
  QrCodeIcon,
  CheckCircleIcon,
  InfoIcon,
  AlertCircleIcon,
  Loader2,
} from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@design-system/react/components/ui/drawer'
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
import { useMediaQuery } from '@/hooks/use-media-query'
import { mapApiError, formatErrorMessage } from '@/utils/error-mappers'
import { cn } from '@design-system/react/helpers/cn'
import { useApplication } from '@/hooks/use-application'
import { useWallet } from '../../_hooks/use-wallet'
import { useAction, useActionForm } from '@/services/actions/lib/client'
import { PixQRData, parsePixQR } from '@/helpers/parse-pix-qr'
import { debounce } from 'lodash'
import { toast } from '@design-system/react/components/ui/use-toast'

// Tipos
type TransactionType = 'sell' | 'buy' | 'pay'

// Componente principal
export default function WalletTransactionForm() {
  // Estado local
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
        console.log('Iniciando transação de wallet:', result)
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

  const handleEstimate = debounce(async (amount: string) => {
    if (!amount) return

    setIsEstimating(true)

    try {
      const address = form.getValues('address')

      const result = await estimate.execute({
        amount,
        address,
        type: transactionType as TransactionType,
      })

      // Setting form errors inside a requestAnimationFrame to avoid triggering
      // immediate re-renders that might cause loops
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
  }, 1500)

  const handleTypeChange = async (type: TransactionType) => {
    form.setValue('type', type)
    form.setValue('amount', '')
    await estimate.execute({ type, amount: '' })

    // Se mudar para modo 'pay', limpa os dados do PIX anterior e configura o formulário
    if (type === 'pay') {
      setPixData(null)
      form.setValue('address', '') // Limpa o endereço anterior
      return
    }

    // Define o endereço para o da carteira atual
    form.setValue('address', wallet.current?.address)
  }

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
  const handleQrResult = (result: any | string) => {
    console.log(result)

    if (!result) {
      return
    }

    const qrValue = typeof result === 'string' ? result : result.getText()
    console.log('QR Code lido com sucesso:', qrValue)

    // Processar QR PIX
    const parsedPixData = parsePixQR(qrValue)
    if (parsedPixData) {
      console.log('Dados PIX detectados:', parsedPixData)
      setPixData(parsedPixData)

      // Preencher valor se disponível no QR PIX
      if (parsedPixData.value) {
        console.log('Valor PIX detectado:', parsedPixData.value)
        const amount = parsedPixData.value * 100

        // O valor está em BRL, mas será tratado corretamente por createEstimateParams
        form.setValue('amount', String(amount))
        // Definimos o tipo como 'pay' para que seja tratado como venda com valor em BRL
        form.setValue('type', 'pay')

        handleEstimate(amount.toString())

        toast({
          title: 'Transação iniciada',
          description: 'A transação foi iniciada com sucesso.',
        })
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

  const isValid = useCallback(() => {
    const userWalletAddress = wallet.current?.address

    const transactionEstimate = estimate.response?.data
    const currentTransactionType = form.getValues('type')
    const transactionAddress = form.getValues('address')

    const isSubmitting = form.actionState.isSubmitting
    const isWalletDisconnected =
      !userWalletAddress && currentTransactionType !== 'pay'
    const isEstimateInvalid = !transactionEstimate
    const isFromAmountZero = transactionEstimate?.fromAmount === 0
    const isPayAddressMissing =
      currentTransactionType === 'pay' && !transactionAddress
    const isPixDataMissing = currentTransactionType === 'pay' && !pixData
    const isCurrentlyEstimating = isEstimating
    const hasAmountError = Boolean(form.formState.errors.amount)

    // Para depuração
    console.log('Validação de formulário:', {
      currentTransactionType,
      isWalletDisconnected,
      isEstimateInvalid,
      isFromAmountZero,
      isPayAddressMissing,
      isPixDataMissing,
      isCurrentlyEstimating,
      hasAmountError,
    })

    return !!(
      isSubmitting ||
      isWalletDisconnected ||
      isEstimateInvalid ||
      isFromAmountZero ||
      isPayAddressMissing ||
      isPixDataMissing ||
      isCurrentlyEstimating ||
      hasAmountError
    )
  }, [])

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

  const transactionType = form.watch('type')

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
                      field.value === 'pay'
                        ? 'Valor em R$'
                        : transactionTypeConfig[transactionType]
                            .amountPlaceholder
                    }
                    currency={
                      {
                        buy: 'BRL',
                        sell: 'ADA',
                        pay: 'BRL',
                      }[transactionType] as 'BRL' | 'ADA'
                    }
                    locale="pt-BR"
                    variant="lined"
                    className="text-xl font-semibold leading-none"
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e)
                      handleEstimate(e.target.value)
                    }}
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
                          onClick={() => handleTypeChange('buy')}
                        >
                          <span
                            className={cn([
                              'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                              field.value === 'buy' && 'bg-primary text-white',
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
                          onClick={() => handleTypeChange('sell')}
                        >
                          <span
                            className={cn([
                              'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                              field.value === 'sell' && 'bg-primary text-white',
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
                          onClick={() => handleTypeChange('pay')}
                        >
                          <span
                            className={cn([
                              'w-10 h-10 rounded-full bg-secondary flex items-center justify-center',
                              field.value === 'pay' && 'bg-primary text-white',
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
              <div className="bg-primary/10 p-3 rounded-md mb-2">
                <label className="text-sm font-medium flex items-center gap-2 text-primary">
                  <InfoIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Pague boletos e chaves PIX usando sua ADA</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Escaneie um QR code PIX ou informe a chave PIX de destino e o
                  valor a ser pago em reais.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem variant="unstyled" className="space-y-0">
                  <FormLabel>Chave PIX de destino</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <input
                        ref={addressInputRef}
                        type="text"
                        placeholder="Chave PIX (CPF, telefone, email, etc.)"
                        className="w-full border rounded-md px-3 py-2"
                        {...field}
                        onChange={(e) => {
                          handleQrResult(e.target.value)
                          field.onChange(e.target.value)
                        }}
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
                          Aponte a câmera para um QR Code PIX válido
                        </p>
                        <div className="w-full aspect-square relative border-2 border-dashed border-primary/30 rounded-lg overflow-hidden mb-3">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-3/4 h-3/4 border-2 border-primary rounded-lg animate-pulse opacity-60"></div>
                          </div>
                          <QrReader
                            onResult={(result) => handleQrResult(result)}
                            className="absolute inset-0 h-full w-full object-cover"
                            constraints={{
                              facingMode: 'environment',
                              width: { ideal: 1280 },
                              height: { ideal: 720 },
                            }}
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
                    <div className="text-primary text-sm mt-4 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>QR Code lido com sucesso!</span>
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Preview da transação */}
        <TransactionPreview
          isLoading={estimate.isSubmitting}
          estimate={estimate.response?.success ? estimate.response.data : null}
          pixMode={transactionType === 'pay'}
          pixData={
            estimate.response?.success ? estimate.response.data?.pix : null
          }
          onExpires={() => {
            // estimate.execute({
            //   type: transactionType,
            //   amount: form.getValues('amount'),
            // })
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
