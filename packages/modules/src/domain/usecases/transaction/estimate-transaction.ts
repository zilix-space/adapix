import { IExchangeProvider } from '../../../interfaces/providers/exchange'
import { IFiatProvider } from '../../../interfaces/providers/fiat'
import { IMarketProvider } from '../../../interfaces/providers/market'

export class EstimateTransactionUseCase {
  constructor(
    private readonly fiatExchangeProvider: IFiatProvider,
    private readonly exchangeProvider: IExchangeProvider,
    private readonly marketProvider: IMarketProvider,
  ) {}

  async execute({ type, amount }: { type: 'buy' | 'sell'; amount: number }) {
    const adaPrice = await this.marketProvider.getQuote('cardano', 'brl')

    if (type === 'sell') {
      const exchangeEstimate =
        await this.exchangeProvider.getEstimateForExchange({
          amount,
          from: 'ada',
          to: 'usdttrc20',
        })

      const fiatEstimate =
        await this.fiatExchangeProvider.getEstimateForExchange({
          type: 'buy',
          amount: exchangeEstimate.outAmount,
        })

      return {
        fromAmount: amount,
        toAmount: Number(fiatEstimate.sendInFiat),

        fromCurrency: 'ADA',
        toCurrency: 'BRL',

        fee:
          Number(fiatEstimate.feeInFiat) +
          Number(exchangeEstimate.networkFee) * Number(adaPrice),
        toCurrencyPrice: adaPrice,
      }
    }

    const fiatEstimate = await this.fiatExchangeProvider.getEstimateForExchange(
      {
        type: 'sell',
        amount,
      },
    )

    const exchangeEstimate = await this.exchangeProvider.getEstimateForExchange(
      {
        amount: fiatEstimate.sendInCrypto,
        from: 'usdttrc20',
        to: 'ada',
      },
    )

    const totalAda = exchangeEstimate.outAmount
    const fee =
      Number(fiatEstimate.feeInFiat) +
      Number(exchangeEstimate.networkFee) * Number(adaPrice)

    return {
      fromAmount: amount,
      toAmount: totalAda,
      fromCurrency: 'BRL',
      toCurrency: 'ADA',
      fee,
      toCurrencyPrice: adaPrice,
    }
  }
}
