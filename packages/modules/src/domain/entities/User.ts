import { Transaction } from './Transaction'

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
    status: 'pending' | 'approved' | 'rejected' | 'submitted'
    statusReason?: string
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
  image?: string

  settings: UserSettings
  transactions?: Transaction[]

  createdAt: Date
  updatedAt: Date
}
