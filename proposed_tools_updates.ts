import z from 'zod'

// Enums para valores que se repetem entre ferramentas
const TransactionStatusEnum = z.enum([
  'PENDING_DEPOSIT', 
  'PENDING_EXCHANGE', 
  'PENDING_PAYMENT', 
  'COMPLETED', 
  'EXPIRED'
])

const TransactionTypeEnum = z.enum(['buy', 'sell'])

const CurrencyEnum = z.enum(['BRL', 'ADA'])

// Definições aprimoradas das ferramentas
export const improvedTools = {
  update_profile: tool({
    description: 
      'Atualiza os dados de pagamento do usuário (chave PIX ou endereço de carteira Cardano). Use esta ferramenta sempre que o usuário quiser mudar suas informações de recebimento ou envio.',
    parameters: z.object({
      pix: z.string().optional().describe('Chave PIX do usuário para receber pagamentos em BRL'),
      wallet: z.string().optional().describe('Endereço da carteira Cardano para receber ADA'),
    }),
  }),

  list_deposits: tool({
    description:
      'Lista o histórico de depósitos (compras de ADA) do usuário, opcionalmente filtrados por status. Os resultados são ordenados do mais recente para o mais antigo.',
    parameters: z.object({
      status: TransactionStatusEnum.optional().describe(
        'Status da transação para filtrar os resultados. Se omitido, mostra todas as transações.'
      ),
    }),
  }),

  list_withdrawals: tool({
    description:
      'Lista o histórico de saques (vendas de ADA) do usuário, opcionalmente filtrados por status. Os resultados são ordenados do mais recente para o mais antigo.',
    parameters: z.object({
      status: TransactionStatusEnum.optional().describe(
        'Status da transação para filtrar os resultados. Se omitido, mostra todas as transações.'
      ),
    }),
  }),

  get_estimate_transaction: tool({
    description:
      'Gera uma estimativa para compra ou venda de ADA, mostrando o valor aproximado, taxas e validade da cotação. Use esta ferramenta antes de criar qualquer transação.',
    parameters: z.object({
      type: TransactionTypeEnum.describe(
        'Tipo de transação: "buy" para comprar ADA com BRL, "sell" para vender ADA e receber BRL'
      ),
      in: CurrencyEnum.optional().describe(
        'Moeda de origem da conversão. Use "BRL" para compras, "ADA" para vendas'
      ),
      amount: z.number().describe(
        'Valor a ser convertido. Para compras, é o valor em BRL. Para vendas, é o valor em ADA'
      ),
    }),
  }),

  create_buy_transaction: tool({
    description:
      'Cria uma nova transação de compra (depósito) e envia informações de checkout. Esta ferramenta automaticamente envia a chave PIX para pagamento em uma mensagem separada.',
    parameters: z.object({
      amount: z.number().describe('Valor em BRL a ser depositado'),
      address: z.string().optional().describe(
        'Endereço da carteira Cardano para receber ADA. Se não fornecido, usa a carteira registrada do usuário.'
      ),
    }),
  }),

  create_sell_transaction: tool({
    description:
      'Cria uma nova transação de venda (saque) e envia informações de checkout. Esta ferramenta automaticamente envia o endereço da carteira Cardano para envio de ADA em uma mensagem separada.',
    parameters: z.object({
      amount: z.number().describe('Valor em ADA a ser vendido'),
      address: z.string().optional().describe(
        'Chave PIX para receber BRL. Se não fornecido, usa a chave PIX registrada do usuário.'
      ),
    }),
  }),

  get_pix_from_qr_code_image: tool({
    description:
      'Extrai informações PIX de uma imagem de QR Code enviada pelo usuário. Esta ferramenta tentará ler o código PIX e retornar os dados contidos nele.',
    parameters: z.object({
      url: z.string().optional(),
    }),
  }),

  get_latest_news: tool({
    description:
      'Busca as últimas notícias do ecossistema Cardano. Use para manter o usuário informado sobre atualizações, eventos e desenvolvimentos da rede Cardano.',
    parameters: z.object({
      count: z.number().optional().describe('Número de notícias a retornar. Padrão é 5.'),
    }),
  }),

  get_user_wallet_info: tool({
    description:
      'Busca informações da carteira Cardano (saldo, detalhes do endereço) para um endereço específico ou a carteira registrada do usuário.',
    parameters: z.object({
      address: z.string().optional().describe(
        'Endereço da carteira Cardano. Se não fornecido, usa a carteira registrada do usuário.'
      ),
    }),
  }),

  get_user_wallet_history: tool({
    description:
      'Busca o histórico recente de transações de uma carteira Cardano. Mostra as transações mais recentes na blockchain.',
    parameters: z.object({
      address: z.string().optional().describe(
        'Endereço da carteira Cardano. Se não fornecido, usa a carteira registrada do usuário.'
      ),
      count: z.number().default(10).optional().describe(
        'Número de transações a retornar. Padrão é 10.'
      ),
    }),
  }),
}