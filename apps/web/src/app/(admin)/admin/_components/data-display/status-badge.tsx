import { Badge } from '@design-system/react/components/ui/badge'
import { KYCStatus } from '@app/modules/src/domain/entities/User'

/**
 * Type for role variants based on User entity
 */
type RoleVariant = 'USER' | 'ADMIN'

/**
 * Type for KYC variants based on User entity KYCStatus enum
 */
type KYCVariant = `${KYCStatus}`

/**
 * Type for transaction variants
 */
type TransactionVariant =
  | 'pending_deposit'
  | 'pending_exchange'
  | 'pending_payment'
  | 'completed'
  | 'expired'

/**
 * Props for the StatusBadge component
 */
interface StatusBadgeProps {
  variant: RoleVariant | KYCVariant | TransactionVariant
  type?: 'role' | 'kyc' | 'transaction'
  className?: string
}

/**
 * Label mapping for variants
 */
const variantLabels: Record<
  RoleVariant | KYCVariant | TransactionVariant,
  string
> = {
  // Role labels
  USER: 'User',
  ADMIN: 'Admin',

  // KYC labels
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  submitted: 'Submitted',

  // Transaction labels
  pending_deposit: 'Pending Deposit',
  pending_exchange: 'Pending Exchange',
  pending_payment: 'Pending Payment',
  completed: 'Completed',
  expired: 'Expired',
}

/**
 * Variant mapping for badge styles
 */
const variantMapping: Record<
  RoleVariant | KYCVariant | TransactionVariant,
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'purple'
> = {
  // Role variants
  USER: 'outline',
  ADMIN: 'purple',

  // KYC variants
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  submitted: 'info',

  // Transaction variants
  pending_deposit: 'warning',
  pending_exchange: 'info',
  pending_payment: 'purple',
  completed: 'success',
  expired: 'destructive',
}

/**
 * StatusBadge component for displaying user roles, KYC status and transaction status with appropriate styling
 */
export function StatusBadge({ variant, className }: StatusBadgeProps) {
  return (
    <Badge variant={variantMapping[variant]} className={className}>
      {variantLabels[variant]}
    </Badge>
  )
}
