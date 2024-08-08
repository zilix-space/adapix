export function parseUnitPrice(
  unitAmount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  unitAmount = unitAmount / 100

  return unitAmount.toLocaleString(locale, {
    style: 'currency',
    currency,
  })
}
