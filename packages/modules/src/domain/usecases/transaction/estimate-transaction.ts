import { IExchangeProvider } from '../../../interfaces/providers/exchange'
import { IFiatProvider } from '../../../interfaces/providers/fiat'
import { IMarketProvider } from '../../../interfaces/providers/market'

export class EstimateTransactionUseCase {
  constructor(
    private readonly fiatExchangeProvider: IFiatProvider,
    private readonly exchangeProvider: IExchangeProvider,
    private readonly marketProvider: IMarketProvider,
  ) {}

  async execute({
    type,
    amount,
  }: {
    type: 'buy' | 'sell' | 'pay'
    amount: number
  }) {
    const adaPrice = await this.marketProvider.getQuote('cardano', 'brl')

    switch (type) {
      case 'sell': {
        console.log(
          '[EstimateTransactionUseCase] Sell case - input amount:',
          amount,
        )

        const exchangeEstimate =
          await this.exchangeProvider.getEstimateForExchange({
            amount,
            from: 'ada',
            to: 'usdttrc20',
          })
        console.log(
          '[EstimateTransactionUseCase] Sell - exchangeEstimate:',
          JSON.stringify(exchangeEstimate),
        )

        const fiatEstimate =
          await this.fiatExchangeProvider.getEstimateForExchange({
            type: 'buy',
            amount: exchangeEstimate.outAmount,
          })
        console.log(
          '[EstimateTransactionUseCase] Sell - fiatEstimate:',
          JSON.stringify(fiatEstimate),
        )

        const fee =
          Number(fiatEstimate.feeInFiat) +
          Number(exchangeEstimate.networkFee) * Number(adaPrice)

        console.log('[EstimateTransactionUseCase] Sell - calculated fee:', fee)
        console.log('[EstimateTransactionUseCase] Sell - adaPrice:', adaPrice)

        const result = {
          fromAmount: amount,
          toAmount: Number(fiatEstimate.sendInFiat),
          fromCurrency: 'ADA',
          toCurrency: 'BRL',
          fee,
          toCurrencyPrice: adaPrice,
        }

        console.log(
          '[EstimateTransactionUseCase] Sell - result:',
          JSON.stringify(result),
        )
        return result
      }

      case 'buy': {
        console.log(
          '[EstimateTransactionUseCase] Buy case - input amount:',
          amount,
        )

        // USD TO
        const fiatEstimate =
          await this.fiatExchangeProvider.getEstimateForExchange({
            type: 'sell',
            amount,
          })
        console.log(
          '[EstimateTransactionUseCase] Buy - fiatEstimate:',
          JSON.stringify(fiatEstimate),
        )

        // USD TO ADA
        const exchangeEstimate =
          await this.exchangeProvider.getEstimateForExchange({
            amount: fiatEstimate.sendInCrypto,
            from: 'usdttrc20',
            to: 'ada',
          })
        console.log(
          '[EstimateTransactionUseCase] Buy - exchangeEstimate:',
          JSON.stringify(exchangeEstimate),
        )

        const totalAda = exchangeEstimate.outAmount
        const fee =
          Number(fiatEstimate.feeInFiat) +
          Number(exchangeEstimate.networkFee) * Number(adaPrice)

        console.log('[EstimateTransactionUseCase] Buy - totalAda:', totalAda)
        console.log('[EstimateTransactionUseCase] Buy - calculated fee:', fee)
        console.log('[EstimateTransactionUseCase] Buy - adaPrice:', adaPrice)

        const result = {
          fromAmount: amount,
          toAmount: totalAda,
          fromCurrency: 'BRL',
          toCurrency: 'ADA',
          fee,
          toCurrencyPrice: adaPrice,
        }

        console.log(
          '[EstimateTransactionUseCase] Buy - result:',
          JSON.stringify(result),
        )
        return result
      }

      case 'pay': {
        console.log(
          '[EstimateTransactionUseCase] Pay case - input amount:',
          amount,
        )

        // Primeiro, calculamos quanto de ADA é necessário para o valor em BRL desejado
        // Invertendo o fluxo do "sell" para obter o valor em ADA
        const targetBrlAmount = amount

        // Passo 1: Estimar quanto USDT seria necessário para obter o valor alvo em BRL
        const reverseFiatEstimate =
          await this.fiatExchangeProvider.getEstimateForExchange({
            type: 'sell', // Invertendo a operação
            amount: targetBrlAmount,
          })
        console.log(
          '[EstimateTransactionUseCase] Pay - reverseFiatEstimate:',
          JSON.stringify(reverseFiatEstimate),
        )

        // Passo 2: Estimar quanto de ADA seria necessário para obter o USDT
        const reverseExchangeEstimate =
          await this.exchangeProvider.getEstimateForExchange({
            amount: reverseFiatEstimate.sendInCrypto,
            from: 'usdttrc20',
            to: 'ada',
          })
        console.log(
          '[EstimateTransactionUseCase] Pay - reverseExchangeEstimate:',
          JSON.stringify(reverseExchangeEstimate),
        )

        // Agora temos a quantidade de ADA necessária
        const requiredAdaAmount = reverseExchangeEstimate.outAmount
        console.log(
          '[EstimateTransactionUseCase] Pay - requiredAdaAmount:',
          requiredAdaAmount,
        )

        // Agora fazemos o fluxo normal "sell" com a quantidade de ADA calculada
        const exchangeEstimate =
          await this.exchangeProvider.getEstimateForExchange({
            amount: requiredAdaAmount,
            from: 'ada',
            to: 'usdttrc20',
          })
        console.log(
          '[EstimateTransactionUseCase] Pay - exchangeEstimate:',
          JSON.stringify(exchangeEstimate),
        )

        const fiatEstimate =
          await this.fiatExchangeProvider.getEstimateForExchange({
            type: 'buy',
            amount: exchangeEstimate.outAmount,
          })
        console.log(
          '[EstimateTransactionUseCase] Pay - fiatEstimate:',
          JSON.stringify(fiatEstimate),
        )

        const fee =
          Number(fiatEstimate.feeInFiat) +
          Number(exchangeEstimate.networkFee) * Number(adaPrice)

        console.log('[EstimateTransactionUseCase] Pay - calculated fee:', fee)
        console.log('[EstimateTransactionUseCase] Pay - adaPrice:', adaPrice)

        const result = {
          fromAmount: requiredAdaAmount, // A quantidade de ADA necessária
          toAmount: amount, // O valor alvo em BRL que o usuário deseja pagar
          fromCurrency: 'ADA',
          toCurrency: 'BRL',
          fee,
          toCurrencyPrice: adaPrice,
        }

        console.log(
          '[EstimateTransactionUseCase] Pay - result:',
          JSON.stringify(result),
        )
        return result
      }

      default:
        throw new Error(`Invalid transaction type: ${type}`)
    }
  }
}
