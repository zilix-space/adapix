'use client'

import { StatusBadge } from '../../../_components/data-display/status-badge'
import { formatDate } from '../../../_utils/format'
import { Button } from '@design-system/react/components/ui/button'
import { Eye, Mail, MessageCircle, Phone } from 'lucide-react'
import type { User } from '../../../_types'

/**
 * Props for the UserHeader component
 */
interface UserHeaderProps {
  user: User
  onViewKYC: () => void
}

/**
 * UserHeader component that displays user's main information and actions
 */
export function UserHeader({ user, onViewKYC }: UserHeaderProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${user.email}`
  }

  const handlePhoneClick = () => {
    if (user.settings?.contact?.phone) {
      window.location.href = `tel:${user.settings.contact.phone}`
    }
  }

  const handleTelegramClick = () => {
    if (user.settings?.contact?.telegram) {
      window.open(`https://t.me/${user.settings.contact.telegram}`, '_blank')
    }
  }

  return (
    <div className="pb-6 border-b">
      <div className="flex flex-col gap-6">
        {/* User Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <StatusBadge variant={user.role} />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              KYC Status
            </p>
            <StatusBadge
              variant={user.settings?.kyc?.status || 'pending'}
              type="kyc"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Created At
            </p>
            <p className="text-lg font-medium">{formatDate(user.createdAt)}</p>
          </div>

          {user.settings?.contact?.phone && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg font-medium">
                {user.settings.contact.phone}
              </p>
            </div>
          )}

          {user.settings?.contact?.telegram && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Telegram
              </p>
              <p className="text-lg font-medium">
                @{user.settings.contact.telegram}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEmailClick}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>

          {user.settings?.contact?.phone && (
            <Button variant="outline" size="sm" onClick={handlePhoneClick}>
              <Phone className="h-4 w-4 mr-2" />
              Phone
            </Button>
          )}

          {user.settings?.contact?.telegram && (
            <Button variant="outline" size="sm" onClick={handleTelegramClick}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Telegram
            </Button>
          )}

          <Button variant="default" size="sm" onClick={onViewKYC}>
            <Eye className="h-4 w-4 mr-2" />
            View KYC
          </Button>
        </div>
      </div>
    </div>
  )
}
