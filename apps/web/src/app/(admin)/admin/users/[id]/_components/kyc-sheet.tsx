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
import { useAction, useActionForm } from '@/services/actions/lib/client'
import { sendKYCUpdateAction } from '../../actions'
import { toast } from '@design-system/react/components/ui/use-toast'
import type { User } from '../../../_types'
import {
  FormField,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import {
  RadioGroup,
  RadioGroupItem,
} from '@design-system/react/components/ui/radio-group'
import { cn } from '@design-system/react/helpers/cn'
import { kycUpdateSchema } from '../../schemas'
import { KYCUpdateForm } from './user-kyc-update-form'
import { UserKycDocumentViewer } from './user-kyc-document-viewer'

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
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const userSettings = user?.settings
  const userKyc = userSettings?.kyc
  const userKycStatus = userKyc?.status

  const isPending: boolean =
    userKycStatus === 'pending' || userKycStatus === 'submitted'

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full md:max-w-xl overflow-y-auto h-full pb-0">
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
              <p className="text-sm">{userKyc.data?.name || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Document</p>
                <p className="text-sm">
                  {userKyc.data?.document
                    ? formatDocument(user.settings.kyc.data.document)
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Birth Date</p>
                <p className="text-sm">
                  {userKyc.data?.birthdate
                    ? user.settings.kyc.data.birthdate
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          {userKyc.data?.address && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Address
              </h3>
              <p className="text-sm">
                {[
                  userKyc.data.address.street,
                  userKyc.data.address.number,
                  userKyc.data.address.complement,
                  userKyc.data.address.neighborhood,
                  userKyc.data.address.city,
                  userKyc.data.address.state,
                  userKyc.data.address.country,
                  userKyc.data.address.zipCode,
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
                <p className="text-sm">{userSettings.payment?.wallet || '-'}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Documents
            </h3>
            <div className="space-y-4">
              <UserKycDocumentViewer user={user} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <KYCUpdateForm user={user} />
      </SheetContent>
    </Sheet>
  )
}
