'use client'

import { StatusBadge } from '../../../_components/data-display/status-badge'
import { formatDate, formatDocument } from '../../../_utils/format'
import { Button } from '@design-system/react/components/ui/button'
import { Eye, Mail, MessageCircle, Phone, MapPin } from 'lucide-react'
import type { User } from '../../../_types'
import { KYCSheet } from './kyc-sheet'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'

/**
 * Props for the UserBaseInfoSection component
 */
interface UserBaseInfoSectionProps {
  user: User
}

/**
 * UserBaseInfoSection component that displays essential user information
 */
export function UserBaseInfoSection({ user }: UserBaseInfoSectionProps) {
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
    <div className="flex flex-col gap-6">
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start gap-6 px-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge variant={user.role} />
              <StatusBadge
                variant={user.settings?.kyc?.status || 'pending'}
                type="kyc"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
        {/* Documents Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Documents
          </h3>
          <div className="space-y-1">
            {user.settings?.kyc?.data?.document && (
              <p className="text-sm">
                <span className="font-medium">Document:</span>{' '}
                {formatDocument(user.settings.kyc.data.document)}
              </p>
            )}
            {user.settings?.kyc?.data?.birthdate && (
              <p className="text-sm">
                <span className="font-medium">Birth Date:</span>{' '}
                {user.settings.kyc.data.birthdate}
              </p>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
          <div className="space-y-1">
            {user.settings?.contact?.phone && (
              <p className="text-sm">
                <span className="font-medium">Phone:</span>{' '}
                {user.settings.contact.phone}
              </p>
            )}
            {user.settings?.contact?.telegram && (
              <p className="text-sm">
                <span className="font-medium">Telegram:</span>{' '}
                {user.settings.contact.telegram}
              </p>
            )}
          </div>
        </div>

        {/* Address Section */}
        {user.settings?.kyc?.data?.address && (
          <div className="space-y-2 md:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Address
            </h3>
            <p className="text-sm flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {[
                user.settings.kyc.data.address.street,
                user.settings.kyc.data.address.number,
                user.settings.kyc.data.address.complement,
                user.settings.kyc.data.address.neighborhood,
                user.settings.kyc.data.address.city,
                user.settings.kyc.data.address.state,
                user.settings.kyc.data.address.country,
                user.settings.kyc.data.address.zipCode,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 py-4 border-t border-b px-6">
        <KYCSheet user={user}>
          <Button variant="default" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View KYC
          </Button>
        </KYCSheet>

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
      </div>
    </div>
  )
}
