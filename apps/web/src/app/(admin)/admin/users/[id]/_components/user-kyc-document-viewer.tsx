import {
  KYCRejectionReason,
  KYCStatus,
} from '@app/modules/src/domain/entities/User'
import type { User } from '../../../_types'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@design-system/react/components/ui/badge'
import { Button } from '@design-system/react/components/ui/button'

/**
 * Map of document types to their display properties
 */
const DOCUMENT_MAP = {
  documentFront: {
    title: 'Document Front',
    invalidReason: KYCRejectionReason.INVALID_DOCUMENT_FRONT,
    alt: 'Document Front',
  },
  documentBack: {
    title: 'Document Back',
    invalidReason: KYCRejectionReason.INVALID_DOCUMENT_BACK,
    alt: 'Document Back',
  },
  selfie: {
    title: 'Selfie',
    invalidReason: KYCRejectionReason.INVALID_SELFIE,
    alt: 'Selfie',
  },
  selfieWithDocument: {
    title: 'Selfie with Document',
    invalidReason: KYCRejectionReason.INVALID_SELFIE_WITH_DOCUMENT,
    alt: 'Selfie with Document',
  },
} as const

/**
 * Component to display a single KYC document with its status
 * @param documentUrl - URL of the document image
 * @param documentType - Type of the document (front, back, selfie etc)
 * @param isInvalid - Whether the document was marked as invalid
 * @param showValidation - Whether to show validation status
 * @returns JSX.Element
 */
function DocumentItem({
  documentUrl,
  documentType,
  isInvalid,
  showValidation,
}: {
  documentUrl: string
  documentType: keyof typeof DOCUMENT_MAP
  isInvalid?: boolean
  showValidation: boolean
}) {
  const documentConfig = DOCUMENT_MAP[documentType]

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="h-9 w-9 overflow-hidden rounded-lg border bg-secondary shadow-sm">
        <img
          src={documentUrl}
          alt={documentConfig.alt}
          className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-card-foreground">
            {documentConfig.title}
          </p>
          {showValidation && (
            <Badge
              variant={isInvalid ? 'destructive' : 'success'}
              className="capitalize"
            >
              {isInvalid ? 'Invalid' : 'Valid'}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Click view to open document in new tab
        </p>
      </div>
      <Button size="sm" variant="outline" className="gap-2" asChild>
        <a href={documentUrl} target="_blank" rel="noopener noreferrer">
          <span>View</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      </Button>
    </div>
  )
}

/**
 * Component to display KYC document images with status
 * @param user - User object containing KYC document data
 * @returns JSX.Element | null
 */
export function UserKycDocumentViewer({ user }: { user: User }) {
  if (!user.settings.kyc.data.attachments) return null
  const userKycDocuments = user.settings.kyc.data.attachments
  const userKycStatus = user.settings.kyc.status
  const userKycReasons = user.settings.kyc.reasons || []

  const showValidation =
    userKycStatus === KYCStatus.APPROVED || userKycStatus === KYCStatus.REJECTED

  return (
    <>
      {Object.entries(userKycDocuments).map(([key, documentUrl]) => {
        if (!documentUrl) return null

        const documentType = key as keyof typeof DOCUMENT_MAP

        const isInvalid = userKycReasons.includes(
          DOCUMENT_MAP[documentType].invalidReason,
        )

        return (
          <DocumentItem
            key={key}
            documentUrl={documentUrl}
            documentType={documentType}
            isInvalid={isInvalid}
            showValidation={showValidation}
          />
        )
      })}
    </>
  )
}
