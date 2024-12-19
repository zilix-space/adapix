/**
 * Format currency value
 */
export function formatCurrency(value: number, currency = 'BRL'): string {
  if (currency === 'ADA') {
    return `₳${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format a date string to a localized format
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get status color by status
 */
export function getStatusColor(status: string): string {
  const colors = {
    // User status
    PENDING: 'yellow',
    ACTIVE: 'green',
    BLOCKED: 'red',

    // KYC status
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    info_requested: 'blue',

    // Transaction status
    PENDING_DEPOSIT: 'yellow',
    PENDING_EXCHANGE: 'blue',
    PENDING_PAYMENT: 'purple',
    COMPLETED: 'green',
    EXPIRED: 'red',
  }

  return colors[status as keyof typeof colors] || 'gray'
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Format document number (CPF)
 */
export function formatDocument(doc: string): string {
  return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}
