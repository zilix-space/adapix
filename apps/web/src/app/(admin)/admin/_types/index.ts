import type { UserSettings } from '@app/modules/src/domain/entities/User'

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED'
  createdAt: Date
  kycStatus: string
}

/**
 * Address interface
 */
export interface Address {
  state: string
  city: string
  neighborhood: string
  zipCode: string
  street: string
  number: string
}

/**
 * KYC submission interface
 */
export interface KYCSubmission {
  id: string
  userId: string
  status: 'pending' | 'approved' | 'rejected' | 'info_requested'
  submittedAt: Date
  documents: {
    idFront: string
    idBack: string
    selfie: string
  }
  userData: {
    name: string
    document: string
    birthDate: string
    address: Address
  }
}

/**
 * Transaction interface
 */
export interface AdminTransaction {
  id: string
  userId: string
  type: 'DEPOSIT' | 'WITHDRAW'
  status:
    | 'PENDING_DEPOSIT'
    | 'PENDING_EXCHANGE'
    | 'PENDING_PAYMENT'
    | 'COMPLETED'
    | 'EXPIRED'
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Table column interface
 */
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any) => React.ReactNode
}

/**
 * Filter interface
 */
export interface Filter {
  field: string
  value: string | number | boolean
  operator: 'eq' | 'contains' | 'gt' | 'lt'
}

/**
 * Metric card interface
 */
export interface MetricCard {
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down'
  period?: string
}

/**
 * User interface representing the structure of user data
 */
export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  image?: string
  settings: UserSettings
  createdAt: string
}
