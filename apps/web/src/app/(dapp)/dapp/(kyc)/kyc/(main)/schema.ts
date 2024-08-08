import { z } from 'zod'
import { parse, isAfter, isBefore } from 'date-fns'

export const updateUserDataKycSchema = z.object({
  name: z.string().min(1, 'O nome é necessário'),
  document: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  birthDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data de nascimento inválida')
    .refine((value) => {
      const date = parse(value, 'dd/MM/yyyy', new Date())
      const yearToCompare = new Date().getFullYear() - 18

      return (
        isAfter(date, new Date(1900, 0, 1)) &&
        isBefore(date, new Date(yearToCompare, 0, 1))
      )
    }, 'Você deve ter pelo menos 18 anos'),
})
