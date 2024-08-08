import { IMarketProvider } from '../../interfaces/providers/market'

export class CoingeckoMarketProvider implements IMarketProvider {
  async getQuote(currency: string, outputCurrency: string): Promise<number> {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=${outputCurrency}`,
      {
        // @ts-ignore coingecko api is not typed
        next: {
          tags: ['ada.get-quote'],
          revalidate: 60 * 60,
        },
      },
    )

    const data = await response.json()
    console.log(data)

    return data[currency][outputCurrency]
  }
}
