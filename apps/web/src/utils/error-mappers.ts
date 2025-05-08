// Documentação de referência dos códigos de erro da SimpleSwap/ChangeNow:
// https://changenow.io/api/docs

type ErrorMapping = {
  code: string
  message: string
  suggestion?: string
}

export type MappedApiError = {
  originalError?: any
  code: string
  message: string
  suggestion?: string
}

/**
 * Mapeamento de códigos de erro conhecidos da API SimpleSwap/ChangeNow
 */
const EXCHANGE_ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  out_of_range: {
    code: 'MIN_AMOUNT',
    message: 'Valor mínimo não atingido',
    suggestion: 'Tente um valor maior para continuar com a transação.',
  },
  rate_expired: {
    code: 'RATE_EXPIRED',
    message: 'A taxa de câmbio expirou',
    suggestion: 'Por favor, tente novamente para obter uma nova cotação.',
  },
  invalid_address: {
    code: 'INVALID_ADDRESS',
    message: 'Endereço de carteira inválido',
    suggestion: 'Verifique se o endereço está correto e tente novamente.',
  },
  invalid_pair: {
    code: 'INVALID_PAIR',
    message: 'Par de moedas não suportado',
    suggestion: 'Este par de moedas não está disponível para troca.',
  },
  invalid_currency: {
    code: 'INVALID_CURRENCY',
    message: 'Moeda não suportada',
    suggestion: 'Esta moeda não está disponível para troca.',
  },
  limit_exceeded: {
    code: 'LIMIT_EXCEEDED',
    message: 'Limite máximo excedido',
    suggestion: 'O valor da transação excede os limites permitidos.',
  },
  verification_required: {
    code: 'VERIFICATION_REQUIRED',
    message: 'Verificação necessária',
    suggestion: 'É necessário verificar sua identidade para continuar.',
  },
  service_unavailable: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Serviço temporariamente indisponível',
    suggestion: 'Por favor, tente novamente mais tarde.',
  },
}

/**
 * Mapeamento de códigos de erro conhecidos do provedor de pagamento PIX
 */
const FIAT_ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  invalid_pix_key: {
    code: 'INVALID_PIX_KEY',
    message: 'Chave PIX inválida',
    suggestion: 'Verifique se a chave PIX está correta e tente novamente.',
  },
  insufficient_funds: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Saldo insuficiente',
    suggestion: 'Não há saldo suficiente para completar esta transação.',
  },
}

/**
 * Mapeia erros da API de exchange para um formato padronizado
 */
export function mapExchangeError(error: any): MappedApiError {
  // Extrair o código de erro se disponível
  const errorCode = error?.response?.data?.error || error?.message || 'unknown'

  // Buscar mapeamento conhecido ou criar mapeamento genérico
  const errorMapping = EXCHANGE_ERROR_MAPPINGS[errorCode] || {
    code: 'EXCHANGE_ERROR',
    message: 'Erro ao processar a troca',
    suggestion: 'Verifique os dados e tente novamente.',
  }

  return {
    originalError: error,
    ...errorMapping,
  }
}

/**
 * Mapeia erros do provedor de pagamento PIX para um formato padronizado
 */
export function mapFiatError(error: string): MappedApiError {
  const errorCode = error

  const errorMapping = FIAT_ERROR_MAPPINGS[errorCode] || {
    code: 'PAYMENT_ERROR',
    message: 'Erro ao processar o pagamento',
    suggestion: 'Verifique os dados e tente novamente.',
  }

  return {
    originalError: error,
    ...errorMapping,
  }
}

/**
 * Determina o tipo de erro com base na mensagem ou código
 * e aplica o mapeamento apropriado
 */
export function mapApiError(error: Error | string): MappedApiError {
  let errorMessage = ''

  if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = error
  }

  // Tentar identificar a origem do erro
  if (
    errorMessage.includes('exchange') ||
    errorMessage.includes('out_of_range')
  ) {
    return mapExchangeError(error)
  }

  if (errorMessage.includes('pix') || errorMessage.includes('payment')) {
    return mapFiatError(error instanceof Error ? error.message : error)
  }

  // Erro genérico
  return {
    originalError: error,
    code: 'UNKNOWN_ERROR',
    message: 'Ocorreu um erro inesperado',
    suggestion: 'Por favor, tente novamente ou contate o suporte.',
  }
}

/**
 * Formata a mensagem de erro amigável para exibição ao usuário
 */
export function formatErrorMessage(error: MappedApiError): string {
  if (error.suggestion) {
    return `${error.message}. ${error.suggestion}`
  }
  return error.message
}
