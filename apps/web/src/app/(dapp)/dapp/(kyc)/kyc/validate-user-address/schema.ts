import { z } from 'zod'

export const updateUserAddressKycSchema = z.object({
  state: z.string().min(1, 'O estado é necessário'),
  city: z.string().min(1, 'A cidade é necessária'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'O bairro é necessário'),
  zipCode: z.string().min(1, 'O CEP é necessário'),
  street: z.string().min(1, 'A rua é necessária'),
  number: z.string().min(1, 'O número é necessário'),
})
