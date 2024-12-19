import { Badge } from '@design-system/react/components/ui/badge'
import { cn } from '@design-system/react/helpers/cn'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Type for role variants
 */
type RoleVariant = 'USER' | 'ADMIN'

/**
 * Type for KYC variants
 */
type KYCVariant = 'pending' | 'approved' | 'rejected' | 'submitted'

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
 * Status badge variants using cva
 */
const statusBadgeVariants = cva('font-medium', {
  variants: {
    type: {
      role: '',
      kyc: '',
      transaction: '',
    },
    variant: {
      // Role variants
      USER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      ADMIN:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',

      // KYC variants
      pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      submitted:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',

      // Transaction variants
      pending_deposit:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      pending_exchange:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      pending_payment:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
  },
  defaultVariants: {
    type: 'role',
  },
})

/**
 * Props for the StatusBadge component
 */
interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
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
 * StatusBadge component for displaying user roles, KYC status and transaction status with appropriate styling
 */
export function StatusBadge({
  variant,
  type = 'role',
  className,
}: StatusBadgeProps) {
  return (
    <Badge className={cn(statusBadgeVariants({ variant, type }), className)}>
      {variantLabels[variant]}
    </Badge>
  )
}
