export interface IMarketProvider {
  getQuote: (currency: string, outputCurrency: string) => Promise<number>
}
