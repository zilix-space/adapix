'use client'

import { UserBaseInfoSection } from './user-base-info-section'
import type { User } from '../../../_types'

/**
 * Props for the UserKYCWrapper component
 */
interface UserKYCWrapperProps {
  user: User
  onApprove: () => Promise<void>
  onReject: (reason: string) => Promise<void>
}

/**
 * UserKYCWrapper component that handles KYC functionality
 */
export function UserKYCWrapper({ user }: UserKYCWrapperProps) {
  return (
    <div className="relative">
      <UserBaseInfoSection user={user} />

      <div className="absolute top-0 right-0"></div>
    </div>
  )
}
