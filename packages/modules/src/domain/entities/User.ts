import { Transaction } from './Transaction'

export enum KYCRejectionReason {
  INVALID_SELFIE = 'invalid_selfie',
  INVALID_SELFIE_WITH_DOCUMENT = 'invalid_selfie_with_document',
  INVALID_DOCUMENT_FRONT = 'invalid_document_front',
  INVALID_DOCUMENT_BACK = 'invalid_document_back',
  INVALID_ADDRESS = 'invalid_address',
  INVALID_DATA = 'invalid_data',
  SUSPICIOUS_DATA = 'suspicious_data',
}

export enum KYCStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUBMITTED = 'submitted',
}

export interface UserSettings {
  contact: {
    phone?: string
    telegram?: string
  }
  utms: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
  payment: {
    pix?: string
    wallet?: string
  }
  kyc: {
    status: KYCStatus
    reasons?: KYCRejectionReason[]
    data: {
      name?: string
      document?: string
      birthdate?: string
      address: {
        country?: string
        state?: string
        city?: string
        neighborhood?: string
        complement?: string
        zipCode?: string
        street?: string
        number?: string
      }
      attachments: {
        selfie?: string
        selfieWithDocument?: string
        documentFront?: string
        documentBack?: string
      }
    }
  }
}

export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  username: string
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED'
  role: 'USER' | 'ADMIN'
  image?: string

  settings: UserSettings
  transactions?: Transaction[]

  createdAt: Date
  updatedAt: Date
}
