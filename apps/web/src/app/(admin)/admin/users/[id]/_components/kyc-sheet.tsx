'use client'

import { Button } from '@design-system/react/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@design-system/react/components/ui/sheet'
import { Textarea } from '@design-system/react/components/ui/textarea'
import { StatusBadge } from '../../../_components/data-display/status-badge'
import { formatDate, formatDocument, formatPhone } from '../../../_utils/format'
import { useState } from 'react'
import type { UserSettings } from '@app/modules/src/domain/entities/User'
import { CheckCircle, XCircle } from 'lucide-react'
import { useAction } from '@/services/actions/lib/client'
import { sendKYCUpdateAction } from '../../actions'
import { toast } from '@design-system/react/components/ui/use-toast'
import type { User } from '../../../_types'

/**
 * Props for the KYCSheet component
 */
interface KYCSheetProps {
  user: User
  children: React.ReactNode
}

/**
 * KYCSheet component that displays user KYC information and approval/rejection actions
 */
export function KYCSheet({ user, children }: KYCSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { execute: sendKYCUpdate, isSubmitting } =
    useAction(sendKYCUpdateAction)

  const isPending =
    user?.settings?.kyc?.status === 'pending' ||
    user?.settings?.kyc?.status === 'submitted'

  const handleSendKYCUpdate = async (status: UserSettings['kyc']['status']) => {
    try {
      await sendKYCUpdate({ id: user.id, status })
      toast({
        title: 'KYC status updated successfully',
        description: 'The KYC status has been updated successfully',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Failed to update KYC status',
        description: 'An error occurred while updating the KYC status',
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full md:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>KYC Information</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Personal Information
            </h3>
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm">
                {user?.settings?.kyc?.data?.name || '-'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Document</p>
                <p className="text-sm">
                  {user?.settings?.kyc?.data?.document
                    ? formatDocument(user.settings.kyc.data.document)
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Birth Date</p>
                <p className="text-sm">
                  {user?.settings?.kyc?.data?.birthdate
                    ? user.settings.kyc.data.birthdate
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          {user?.settings?.kyc?.data?.address && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Address
              </h3>
              <p className="text-sm">
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

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm">
                  {user?.settings?.contact?.phone
                    ? formatPhone(user.settings.contact.phone)
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{user?.email || '-'}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Payment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">PIX</p>
                <p className="text-sm">{user?.settings?.payment?.pix || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Wallet</p>
                <p className="text-sm">
                  {user?.settings?.payment?.wallet || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {user?.settings?.kyc?.data?.attachments?.documentFront && (
                <img
                  src={user.settings.kyc.data.attachments.documentFront}
                  alt="Document Front"
                  className="rounded-lg border"
                />
              )}
              {user?.settings?.kyc?.data?.attachments?.documentBack && (
                <img
                  src={user.settings.kyc.data.attachments.documentBack}
                  alt="Document Back"
                  className="rounded-lg border"
                />
              )}
              {user?.settings?.kyc?.data?.attachments?.selfie && (
                <img
                  src={user.settings.kyc.data.attachments.selfie}
                  alt="Selfie"
                  className="rounded-lg border"
                />
              )}
              {user?.settings?.kyc?.data?.attachments?.selfieWithDocument && (
                <img
                  src={user.settings.kyc.data.attachments.selfieWithDocument}
                  alt="Selfie with Document"
                  className="rounded-lg border"
                />
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {isPending && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Rejection Reason
              </h3>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {isPending && (
          <SheetFooter className="mt-6">
            <Button
              variant="destructive"
              onClick={() => handleSendKYCUpdate('rejected')}
              disabled={!rejectReason || isSubmitting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject KYC
            </Button>
            <Button
              variant="default"
              onClick={() => handleSendKYCUpdate('approved')}
              disabled={isSubmitting}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve KYC
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
