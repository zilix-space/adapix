import { z } from 'zod'

export const createTransactionActionSchema = z.object({
  type: z.enum(['sell', 'buy', 'pay']),
  address: z.string().optional(),
  amount: z.string(),
})

export const estimateTransactionActionSchema = z.object({
  type: z.enum(['sell', 'buy', 'pay']),
  amount: z.string(),
  address: z.string().optional(),
})
