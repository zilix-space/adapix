import { z } from 'zod'
import { KYCRejectionReason, KYCStatus } from '../../../domain/entities/User'

export const userSettingsSchema = z.object({
  contact: z.object({
    phone: z.string().optional(),
    telegram: z.string().optional(),
  }),
  utms: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
  }),
  payment: z.object({
    pix: z.string().optional(),
    wallet: z.string().optional(),
  }),
  kyc: z.object({
    status: z.nativeEnum(KYCStatus),
    reasons: z.array(z.nativeEnum(KYCRejectionReason)).optional(),
    data: z.object({
      name: z.string().optional(),
      document: z.string().optional(),
      birthdate: z.string().optional(),
      address: z.object({
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        neighborhood: z.string().optional(),
        complement: z.string().optional(),
        zipCode: z.string().optional(),
        street: z.string().optional(),
        number: z.string().optional(),
      }),
      attachments: z.object({
        selfie: z.string().optional(),
        selfieWithDocument: z.string().optional(),
        documentFront: z.string().optional(),
        documentBack: z.string().optional(),
      }),
    }),
  }),
})

export const userSettingsDefault: z.infer<typeof userSettingsSchema> = {
  contact: {
    phone: '',
  },
  utms: {
    utm_campaign: '',
    utm_content: '',
    utm_medium: '',
    utm_source: '',
    utm_term: '',
  },
  payment: {
    pix: '',
    wallet: '',
  },
  kyc: {
    status: KYCStatus.PENDING,
    reasons: [],
    data: {
      name: '',
      document: '',
      birthdate: '',
      address: {
        country: '',
        state: '',
        city: '',
        complement: '',
        neighborhood: '',
        zipCode: '',
        street: '',
        number: '',
      },
      attachments: {
        selfieWithDocument: '',
        selfie: '',
        documentFront: '',
        documentBack: '',
      },
    },
  },
}
