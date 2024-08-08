export function formatCurrency(
  amount = 0,
  format: 'BRL' | 'ADA' | string = 'BRL',
): string {
  let result = ''

  if (format === 'BRL') {
    result = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  if (format === 'ADA') {
    // format amount with 6 decimal places of precision
    result = amount.toFixed(6)
    result = `₳ ${result}`
  }

  return result
}
