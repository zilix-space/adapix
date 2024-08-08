export function formatNumber(unformattedNumber: number): string {
  const intl = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 })
  return intl.format(unformattedNumber)
}
