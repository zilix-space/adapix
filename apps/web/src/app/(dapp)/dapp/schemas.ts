import { z } from 'zod'

export const createTransactionActionSchema = z.object({
  type: z.enum(['sell', 'buy']),
  address: z.string().optional(),
  amount: z.string(),
})

export const estimateTransactionActionSchema = z.object({
  type: z.enum(['sell', 'buy']),
  amount: z.string().refine(
    (value) => {
      const valueNumber = Number(value.replace(/\D/g, '') || '0') / 100
      return valueNumber >= 60
    },
    {
      message: 'O valor mínimo para a compra é de R$ 60,00',
    },
  ),
})
