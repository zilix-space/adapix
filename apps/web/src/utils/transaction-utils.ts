/**
 * Normaliza um valor de entrada (string) para um número
 * removendo caracteres não numéricos e dividindo por 100
 */
export function normalizeAmount(amount: string): number {
  return Number(amount.replace(/\D/g, '') || '0') / 100
}

/**
 * Formata um valor numérico para exibição como moeda
 */
export function formatCurrency(
  value: number,
  currency: 'BRL' | 'ADA',
  locale: string = 'pt-BR',
): string {
  if (currency === 'ADA') {
    // Formatar ADA com 6 casas decimais
    return `₳ ${value.toFixed(6)}`
  }

  // Formatar BRL (Real brasileiro)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Gera um objeto com parâmetros para estimativa de transação
 */
export function createEstimateParams(values: {
  type: 'buy' | 'sell' | 'pay'
  amount: string
}) {
  return {
    type: values.type,
    amount: values.amount?.replace(/\D/g, '') || '0',
  }
}

/**
 * Verifica se um endereço da carteira Cardano é válido
 */
export function isValidCardanoAddress(address: string): boolean {
  // Endereços Cardano Shelley começam com 'addr1' e têm comprimento específico
  // Esta é uma validação simplificada, para uma validação completa seria necessário
  // implementar algoritmos específicos da Cardano
  return /^addr1[a-zA-Z0-9]{95,103}$/.test(address)
}

/**
 * Verifica se uma chave PIX é válida
 */
export function isValidPixKey(key: string): boolean {
  // Verifica CPF/CNPJ (apenas números)
  const isCpfCnpj = /^\d{11,14}$/.test(key)

  // Verifica telefone (+5511999999999)
  const isPhone = /^\+55\d{10,11}$/.test(key)

  // Verifica email
  const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(key)

  // Verifica chave aleatória
  const isRandomKey = /^[a-zA-Z0-9]{32,36}$/.test(key)

  return isCpfCnpj || isPhone || isEmail || isRandomKey
}

/**
 * Retorna os limites máximos de transação com fallback para valores padrão
 */
export function getTransactionLimits(): { buy: number; sell: number } {
  return {
    buy: Number(process.env.NEXT_PUBLIC_TRANSACTION_LIMIT_BUY) || 200,
    sell: Number(process.env.NEXT_PUBLIC_TRANSACTION_LIMIT_SELL) || 100,
  }
}
