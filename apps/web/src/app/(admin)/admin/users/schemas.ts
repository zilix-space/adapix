import {
  KYCRejectionReason,
  KYCStatus,
} from '@app/modules/src/domain/entities/User'
import { z } from 'zod'

/**
 * Schema for validating KYC status updates
 */
export const kycUpdateSchema = z.object({
  userId: z.string(),
  status: z.nativeEnum(KYCStatus),
  reasons: z.array(z.nativeEnum(KYCRejectionReason)).optional(),
})
